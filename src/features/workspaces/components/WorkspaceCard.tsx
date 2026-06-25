import { useNavigate } from 'react-router-dom';
import { Workspace } from '../types/workspace.type';
import Avatar from '../../../assets/avatar.png';
import { getWorkspaceAvatar } from '../../../helper/avatar-random';
import { can } from '../../../helper/can-permission';


interface WorkspaceCardProps {
  workspace: Workspace
  workspacePage: number
  onInviteClick: (workspaceId: string) => void
}

export function WorkspaceCard({
  workspace,
  workspacePage,
  onInviteClick,
}: WorkspaceCardProps) {
  const navigate = useNavigate()

  // Giả lập danh sách avatar mẫu (3 hình đầu tiên)
  const placeholderAvatars = [
    Avatar, Avatar, Avatar
  ];

  // Tính toán số lượng member còn lại hiển thị ở badge tròn (+X)
  const memberCount = workspace.memberCount ?? 1;
  const extraMembers = memberCount > 3 ? memberCount - 3 : 0;

  const avatarUrl = getWorkspaceAvatar(workspace._id, workspace.name);

  const permissions = workspace.currentUserAccess?.permissions;
  const canInvite = can(permissions,'workspace:invite_member');

  return (
    <div
      className="relative flex flex-col items-start p-0 bg-white border border-[#E5E5E5] rounded-[10px] transition hover:shadow-sm"
      style={{ width: '328px', height: '192px', boxSizing: 'border-box' }}
    >
      {/* Lớp phủ tương tác điều hướng toàn bộ Card */}
      <button
        type="button"
        onClick={() =>
          navigate(`/workspaces/${workspace._id}/documents`, {
            state: { workspaceSwitcherPage: workspacePage },
          })
        }
        className="absolute inset-0 w-full h-full cursor-pointer rounded-[10px] z-0"
        aria-label={`Open ${workspace.name}`}
      />

      {/* Phần nội dung phía trên (Thông tin Workspace) */}
      <div className="w-full p-5 flex-1 z-10 pointer-events-none">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 overflow-hidden border border-stone-200/60 shadow-sm">
          <img
            src={avatarUrl}
            alt={workspace.name}
            className="w-full h-full object-cover select-none"
            // Dự phòng (Fallback): Nếu ảnh lỗi, hiện chữ cái đầu của Workspace
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerText = workspace.name.charAt(0).toUpperCase();
                parent.className = "mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg";
              }
            }}
          />
        </div>

        {/* Tiêu đề & Role Admin tag */}
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-semibold text-[#111111] line-clamp-1">
            {workspace.name}
          </h3>
          {workspace.currentUserAccess?.role && (
            <span className="px-2.5 py-0.5 text-[11px] font-medium bg-[#111111] text-white rounded-full capitalize">
              {workspace.currentUserAccess.role}
            </span>
          )}
        </div>

        {/* Mô tả */}
        <p className="mt-1 text-[13px] text-stone-400 line-clamp-1">
          {workspace.description || 'Central hub for project planning.'}
        </p>
      </div>

      {/* Đường phân cách chân trang */}
      <hr className="w-full border-t border-[#E5E5E5] m-0 p-0" />

      {/* Phần footer phía dưới (Thành viên) */}
      <div className="w-full h-[56px] px-5 flex items-center justify-between z-10 select-none">
        {/* Khối danh sách Avatar thành viên */}
        <div className="flex items-center -space-x-1.5">
          {/* Nút thêm thành viên (+) */}
          {canInvite && (
            <button
              type="button"
              className="pointer-events-auto relative z-20 flex h-[28px] w-[28px] items-center justify-center rounded-full border border-dashed border-stone-300 bg-white text-stone-400 hover:border-stone-500 hover:text-stone-600 transition"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn hành vi bấm thẻ div/button cha nhảy trang
                onInviteClick(workspace._id); // Thực thi truyền ngược id lên cấp cha để kích hoạt mở Modal
              }}
            >
              <span className="text-[16px] font-light leading-none -mt-0.5">+</span>
            </button>
          )}

          {/* Render danh sách avatar mẫu */}
          {placeholderAvatars.slice(0, Math.min(memberCount, 3)).map((url, index) => (
            <img
              key={index}
              className="h-[28px] w-[28px] rounded-full border-2 border-white object-cover"
              src={url}
              alt="Member avatar"
            />
          ))}

          {/* Badge hiển thị số lượng dư thừa (+22) */}
          {extraMembers > 0 && (
            <div className="flex h-[28px] min-w-[28px] items-center justify-center rounded-full border-2 border-white bg-stone-100 px-1 text-[11px] font-medium text-stone-500">
              +{extraMembers}
            </div>
          )}
        </div>

        {/* Tổng số lượng member hiển thị text */}
        <span className="text-[14px] text-stone-500 font-normal">
          {memberCount} members
        </span>
      </div>
    </div>
  )
}
