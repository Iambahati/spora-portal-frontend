import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { UserProfile } from "@/types/api";

export interface TableColumn<T> {
  id: string;
  header: string | ((props: { column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => 'asc' | 'desc' | false } }) => React.ReactNode);
  accessorKey?: keyof T;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
  enableSorting?: boolean;
  sortingFn?: string;
}

export const userTableColumns: TableColumn<UserProfile>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => {
      const photo = row.original.photo_url;
      const isInitials = typeof photo === 'string' && photo.length === 2 && photo === photo.toUpperCase();
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-sm">
          {isInitials ? photo : (photo ? <img src={photo} alt={row.original.full_name} className="w-8 h-8 rounded-full object-cover" /> : '')}
        </div>
      );
    },
  },
  {
    id: "full_name",
    accessorKey: "full_name",
    enableSorting: true,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.full_name}</div>
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    enableSorting: false,
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.email}</div>
    ),
  },
  {
    id: "role",
    accessorKey: "role",
    enableSorting: false,
    header: "Role",
    cell: ({ row }) => {
      let role = row.original.role;
      // Map 'onboarding-officer' to 'KYC Officer' for display purposes
      const display = role === 'onboarding-officer' ? 'KYC Officer' : role.charAt(0).toUpperCase() + role.slice(1);
      return (
        <Badge variant="outline" className="capitalize">
          {display}
        </Badge>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    enableSorting: false,
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
      let badgeProps = { variant: "secondary" as const, className: "bg-gray-100 text-gray-600 hover:bg-gray-100" };
      if (status === 'active') badgeProps = { variant: "secondary" as const, className: "bg-green-100 text-green-700 hover:bg-green-100" };
      else if (status === 'banned') badgeProps = { variant: "secondary" as const, className: "bg-red-100 text-red-700 hover:bg-red-100" };
      return (
        <Badge variant={badgeProps.variant} className={badgeProps.className}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    enableSorting: false,
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      // Format: 7 July, 2025
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      return (
        <div className="text-muted-foreground">
          {`${day} ${month}, ${year}`}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
              Copy email
            </DropdownMenuItem>
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              {user.status === 'suspended' ? 'Activate' : 'Suspend'} user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
