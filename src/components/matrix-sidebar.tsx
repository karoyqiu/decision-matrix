import { Link } from '@tanstack/react-router';
import {
  BracesIcon,
  HouseIcon,
  ListIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  TableIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useMatrix } from '@/lib/matrix/context';

export function MatrixSidebar() {
  const { matrix, save } = useMatrix();
  const primaryField = matrix.fields.find((field) => field.primary);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link className="[&.active]:bg-primary [&.active]:text-primary-foreground" to="/">
                <HouseIcon />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={save}>
              <SaveIcon />
              Save
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{matrix.name}</SidebarGroupLabel>
          <SidebarGroupAction title="Rename decision matrix">
            <PencilIcon />
            <span className="sr-only">Rename decision matrix</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    className="[&.active]:bg-primary [&.active]:text-primary-foreground"
                    to="/matrix/data"
                  >
                    <TableIcon />
                    Data
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction title="Add data">
                  <PlusIcon />
                  <span className="sr-only">Add data</span>
                </SidebarMenuAction>
                <SidebarMenuSub>
                  {matrix.data.map((data) => {
                    const dataId = data.id as string;
                    return (
                      <SidebarMenuSubItem key={dataId}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            className="[&.active]:bg-primary [&.active]:text-primary-foreground"
                            to="/matrix/data/$dataId"
                            params={{ dataId }}
                          >
                            <BracesIcon />
                            <span className="">
                              {data[primaryField?.id ?? 'id']?.toString() ?? dataId}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    className="[&.active]:bg-primary [&.active]:text-primary-foreground"
                    to="/matrix/fields"
                  >
                    <ListIcon />
                    Fields
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
