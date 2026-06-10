import { NavLink, useNavigate } from 'react-router-dom'
import {
  FileText,
  Users,
  Clock,
  Gear,
  CaretDown,
} from '@phosphor-icons/react';
import { can } from '../../helper/can-permission';
import { WorkspaceSwitcher } from '../../features/workspaces/components/WorkspaceSwitcher';
import { SignOut } from "@phosphor-icons/react";

export function WorkspaceSidebar({ workspace, permissions, workspaceId }) {
  const navItems = [
    {
      label: 'Documents',
      icon: FileText,
      to: `/workspaces/${workspaceId}/documents`,
      show: can(permissions, 'workspace:view'),
    },
    {
      label: 'Members',
      icon: Users,
      to: `/workspaces/${workspaceId}/members`,
      show: can(permissions, 'workspace:view'),
    },
    {
      label: 'Activity log',
      icon: Clock,
      to: `/workspaces/${workspaceId}/activity`,
      show: can(permissions, 'workspace:view_activity_log'),
    },
    {
      label: 'Settings',
      icon: Gear,
      to: `/workspaces/${workspaceId}/settings`,
      show: can(permissions, 'workspace:manage_settings'),
    },
  ];

  const navigate = useNavigate();
  function goHome() {
    navigate('/');
  }

  return (
    <aside className="h-[calc(100vh-64px)] w-70 shrink-0 border-r border-stone-200 bg-white px-5 py-6">
      <div className="mb-5 flex items-center justify-between">
        <WorkspaceSwitcher />
      </div>


      <nav className="flex flex-col gap-1">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition',
                    isActive
                      ? 'bg-stone-100 text-stone-950'
                      : 'text-stone-900 hover:bg-stone-50',
                  ].join(' ')
                }
              >
                <Icon size={18} weight="regular" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}


      </nav>


      <button
        onClick={goHome}
        className="
        mt-auto
        flex items-center gap-3
        rounded-xl
        px-3 py-2.5
        text-[14px] font-medium
        text-stone-900
        transition
        hover:bg-stone-50
        hover:text-red-600
      "
      >
        <SignOut size={18} weight="regular" />
        <span>Exit</span>
      </button>
    </aside>
  )
}