// utils/toast.tsx
import { toast } from 'sonner';
import { CheckCircle, XCircle} from '@phosphor-icons/react';


export const successDeleteToast = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle size={18} weight="fill" />,
    style: {
      background: '#fff',
      color: '#111',
      border: '1px solid #111',
      boxShadow: '0px 4px 12px -1px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '16px',
      gap: '8px',
      minWidth: '300px',
    },
  })
}

export const successToast = (message: string) => {
  toast.success(message, {
    icon: (
      <CheckCircle
        size={18}
        weight="fill"
        color="#15803D"
      />
    ),
    style: {
      background: '#F0FDF4',
      color: '#166534',
      border: '1px solid #15803D',
      boxShadow: '0px 4px 12px -1px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '16px',
      gap: '8px',
      minWidth: '300px',
    },
  })
}


export const errorToast = (message: string) => {
  toast.error(message, {
    icon: (
      <XCircle
        size={18}
        weight="fill"
        color="#B91C1C"
      />
    ),
    style: {
      background: '#FEF2F2',
      color: '#7F1D1D',
      border: '1px solid #B91C1C',
      boxShadow: '0px 4px 12px -1px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '16px',
      gap: '8px',
      minWidth: '300px',
    },
  })
}