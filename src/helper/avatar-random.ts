import wpImg1 from '../assets/workspace_img1.png';
import wpImg2 from '../assets/workspace_img2.png';
import wpImg3 from '../assets/workspace_img3.png';

const AVATAR_IMAGES = [
  wpImg1,
  wpImg2,
  wpImg3
];

// 2. Hàm băm (hash) chuỗi ký tự (ID hoặc Tên) thành một vị trí Index cố định trong mảng
export const getWorkspaceAvatar = (workspaceId, workspaceName) => {
  // Ưu tiên dùng ID để đảm bảo tính độc bản, nếu không có thì dùng Tên
  const key = workspaceId || workspaceName || '';
  
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % AVATAR_IMAGES.length;
  return AVATAR_IMAGES[index];
};