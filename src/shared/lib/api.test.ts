// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import api from './axios'
import { authService } from '../../features/auth/services/auth.service'

vi.mock('../../features/auth/services/auth.service', () => ({
  authService: {
    refreshToken: vi.fn(),
  },
}))

vi.mock('../hooks/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      clearAuth: vi.fn(),
    }),
  },
}))

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

describe('api refresh queue', () => {
  let apiMock: MockAdapter

  beforeEach(() => {
    apiMock = new MockAdapter(api)
    vi.clearAllMocks()
  })

  it('10 concurrent 401 requests should trigger only 1 refresh call', async () => {
    vi.mocked(authService.refreshToken).mockImplementation(async () => {
      await sleep(50)
      return { success: true }
    })

    const requestCallCount: Record<string, number> = {}

    for (let i = 0; i < 10; i++) {
      const url = `/test/${i}`
      requestCallCount[url] = 0

      apiMock.onGet(url).reply(() => {
        requestCallCount[url]++

        if (requestCallCount[url] === 1) {
          return [401, { message: 'Access token expired' }]
        }

        return [200, { id: i, ok: true }]
      })
    }

    const results = await Promise.all(
      Array.from({ length: 10 }, (_, i) => api.get(`/test/${i}`)),
    )

    expect(authService.refreshToken).toHaveBeenCalledTimes(1)

    for (let i = 0; i < 10; i++) {
      expect(results[i].data).toEqual({ id: i, ok: true })
      expect(requestCallCount[`/test/${i}`]).toBe(2)
    }
  })
})