import { Link } from '@tanstack/react-router';
import { ListIcon, PencilIcon, TableIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useMatrix } from '@/lib/matrix/context';

// Menu items.
const items = [
  {
    title: 'Data',
    url: '/matrix/data',
    icon: TableIcon,
  },
  {
    title: 'Fields',
    url: '/matrix/fields',
    icon: ListIcon,
  },
] as const;

export function MatrixSidebar() {
  const { matrix } = useMatrix();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{matrix.name}</SidebarGroupLabel>
          <SidebarGroupAction title="Rename decision matrix">
            <PencilIcon />
            <span className="sr-only">Rename decision matrix</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link className="[&.active]:bg-primary" to={item.url}>
                      <item.icon />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
