import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';
import { io, type Socket } from 'socket.io-client';

import { documentService } from '../service/document.service';
import type { UploadJobStatus, UploadPdfResponse } from '../types/document.type';

// ── Types ────────────────────────────────────────────────────────────────────

interface JobState {
  jobId: string;
  status: UploadJobStatus;
  progress: number;
  documentId?: string;
  errorMessage?: string;
}

interface UploadVariables {
  file: File;
  title?: string;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useUploadPdfWithProgress(workspaceId: string) {
  const queryClient = useQueryClient()
  const abortControllerRef = useRef<AbortController | null>(null);
  const jobIdRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [job, setJob] = useState<JobState | null>(null);

  // ── WebSocket: kết nối và lắng nghe job:progress ─────────────────────────
  useEffect(() => {
    // Chỉ kết nối khi đang có job đang chạy
    if (!job?.jobId) return;

    const socket = io(`http://localhost:3000/progress`, {
      path: '/socket.io',
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-workspace', workspaceId);
    });

    socket.on('job:progress', (payload: JobState) => {
      // Lọc đúng job của lần upload này
      if (payload.jobId !== job.jobId) return;

      setJob(payload);

      // Invalidate list khi hoàn tất để bảng document tự refresh
      if (payload.status === 'COMPLETED') {
        queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // Chỉ re-subscribe khi jobId thay đổi (tức là upload mới bắt đầu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.jobId, workspaceId]);

  // ── Mutation ─────────────────────────────────────────────────────────────
  const upload = useMutation<UploadPdfResponse, Error, UploadVariables>({
    onMutate: async () => {
      const { jobId } = await documentService.createUploadJob(workspaceId)

      jobIdRef.current = jobId

      setJob({
        jobId,
        status: 'UPLOADING',
        progress: 0,
      })

      return { jobId }
    },

    mutationFn: ({ file, title }: UploadVariables) => {
      abortControllerRef.current = new AbortController();

      return documentService.uploadPdfDocument(
        workspaceId,
        file,
        title,
        jobIdRef.current!,
        (event: AxiosProgressEvent) => {
          if (!event.total) return;
          // Phase 1: tiến độ upload thực tế, map vào 0–33%
          const p = Math.round((event.loaded / event.total) * 33);
          setJob(prev => prev ? { ...prev, progress: p } : null);
        },
        abortControllerRef.current.signal,
      );
    },

    onSuccess: (data) => {
      jobIdRef.current = data.jobId;
      setJob(prev => prev ? { ...prev, jobId: data.jobId, status: 'FILE_SAVED', progress: 33 } : null);
    },

    onError: (error) => {
      if (axios.isCancel(error)) return;
      setJob(prev => prev ? { ...prev, status: 'FAILED' } : null);
    },
  });

  // ── Cancel ────────────────────────────────────────────────────────────────
  const cancel = useCallback(async () => {
    // Phase 1: cắt request ngay tại tầng network
    abortControllerRef.current?.abort();

    // Phase 2–3: báo backend dừng và cleanup
    const jobId = jobIdRef.current;
    if (jobId) {
      // fire-and-forget — không block UI reset
      documentService.cancelUpload(workspaceId, jobId).catch(() => { });
    }

    // Ngắt WebSocket ngay, không cần chờ server
    socketRef.current?.disconnect();
    socketRef.current = null;

    // Reset toàn bộ state
    setJob(null);
    jobIdRef.current = null;
    abortControllerRef.current = null;
  }, [workspaceId]);

  const reset = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setJob(null);
    jobIdRef.current = null;
    abortControllerRef.current = null;
  }, []);

  // ── Reset khi COMPLETED hoặc FAILED sau vài giây ──────────────────────────
  useEffect(() => {
    if (job?.status !== 'COMPLETED' && job?.status !== 'FAILED') return;

    const timer = window.setTimeout(() => {
      setJob(null);
      jobIdRef.current = null;
    }, 3000); // card hiển thị thêm 3s trước khi tự dismiss

    return () => window.clearTimeout(timer);
  }, [job?.status]);

  return { upload, cancel, reset, job };
}
