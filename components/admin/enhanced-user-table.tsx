import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import type { AllUsersResponse, UserProfile, AdminUserListParams, UserStatus } from '@/types/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { userTableColumns } from './user-table-columns';
import { Check, ChevronDown } from 'lucide-react';

interface EnhancedUserTableProps {
}

interface TableState {
  data: UserProfile[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    perPage: number;
    from: number;
    to: number;
  };
  filters: {
    search: string;
    role: string;
    status: string;
  };
  sorting: {
    column: string | null;
    direction: 'asc' | 'desc';
  };
}

const INITIAL_STATE: TableState = {
  data: [],
  loading: true,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    perPage: 10, 
    from: 0,
    to: 0,
  },
  filters: {
    search: '',
    role: '',
    status: '',
  },
  sorting: {
    column: 'created_at',
    direction: 'desc',
  },
};

export function EnhancedUserTable({}: EnhancedUserTableProps) {
  const [state, setState] = useState<TableState>(INITIAL_STATE);
  const [searchDebounceTimeout, setSearchDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const didMountRef = useRef(false);
  const lastFetchParamsRef = useRef<string>('');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    () => new Set(userTableColumns.map(col => col.id))
  );
  const [rowFilter, setRowFilter] = useState<'all' | 'selected' | 'unselected'>('all');

  // Debounced search function
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (searchDebounceTimeout) {
      clearTimeout(searchDebounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, search: searchTerm },
        pagination: { ...prev.pagination, currentPage: 1 }
      }));
    }, 300);
    
    setSearchDebounceTimeout(timeout);
  }, [searchDebounceTimeout]);

  // Memoized API parameters (remove useMemo, use plain object to avoid stale closure)
  const apiParams: AdminUserListParams = {
    page: state.pagination.currentPage,
    per_page: state.pagination.perPage,
    search: state.filters.search || undefined,
    role: state.filters.role || undefined,
    status: state.filters.status as UserStatus || undefined,
    sort: state.sorting.column as any || undefined,
  };

  // Fetch users function (no deduplication, always fetch on param change)
  const fetchUsers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response: AllUsersResponse = await apiClient.getAdminUsers(apiParams);
      setState(prev => ({
        ...prev,
        data: Array.isArray(response.data) ? response.data : [],
        loading: false,
        pagination: {
          ...prev.pagination,
          currentPage: response.current_page || 1,
          totalPages: response.last_page || 1,
          totalUsers: response.total || 0,
          perPage: response.per_page || 10,
          from: response.from || ((response.current_page - 1) * response.per_page + 1),
          to: response.to || (response.from ? response.from + (response.data?.length || 0) - 1 : (response.current_page * response.per_page)),
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load users',
      }));
    }
  }, [state.pagination.currentPage, state.pagination.perPage, state.filters, state.sorting]);

  // Effect to fetch data when pagination, filters, or sorting change
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pagination.currentPage, state.pagination.perPage, state.filters, state.sorting]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimeout) {
        clearTimeout(searchDebounceTimeout);
      }
    };
  }, [searchDebounceTimeout]);

  // Event handlers
  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const handleFilterChange = (key: keyof TableState['filters'], value: string) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      pagination: { ...prev.pagination, currentPage: 1 }
    }));
  };

  const handleSortChange = (column: string) => {
    setState(prev => ({
      ...prev,
      sorting: {
        column,
        direction: prev.sorting.column === column && prev.sorting.direction === 'asc' ? 'desc' : 'asc'
      },
      pagination: { ...prev.pagination, currentPage: 1 }
    }));
  };

  const handlePageChange = (page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, currentPage: page }
    }));
  };

  // --- Row Selection Logic ---
  const allVisibleRows = useMemo(() => {
    let rows = state.data;
    if (rowFilter === 'selected') {
      rows = rows.filter(u => selectedRowIds.has(u.id));
    } else if (rowFilter === 'unselected') {
      rows = rows.filter(u => !selectedRowIds.has(u.id));
    }
    return rows;
  }, [state.data, rowFilter, selectedRowIds]);

  const allVisibleRowIds = allVisibleRows.map(u => u.id);
  const allSelected = allVisibleRowIds.length > 0 && allVisibleRowIds.every(id => selectedRowIds.has(id));
  const someSelected = allVisibleRowIds.some(id => selectedRowIds.has(id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRowIds(prev => {
        const next = new Set(prev);
        allVisibleRowIds.forEach(id => next.delete(id));
        return next;
      });
    } else {
      setSelectedRowIds(prev => {
        const next = new Set(prev);
        allVisibleRowIds.forEach(id => next.add(id));
        return next;
      });
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // --- Column Visibility Logic ---
  const handleToggleColumn = (id: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // Always keep at least one column
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // --- UI Render ---
  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10 text-center">
          <input
            type="checkbox"
            aria-label="Select all"
            checked={allSelected}
            ref={el => { if (el) el.indeterminate = !allSelected && someSelected; }}
            onChange={handleSelectAll}
          />
        </TableHead>
        {userTableColumns.filter(col => visibleColumns.has(col.id)).map((column) => (
          <TableHead key={column.id} className="font-medium">
            {typeof column.header === 'function' ? (
              column.header({
                column: {
                  toggleSorting: () => { handleSortChange(column.id); },
                  getIsSorted: () => {
                    if (state.sorting.column === column.id) return state.sorting.direction;
                    return false;
                  }
                }
              })
            ) : (
              <span>{column.header}</span>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  const renderTableBody = () => {
    if (state.loading) {
      return (
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="w-10 text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
              {userTableColumns.filter(col => visibleColumns.has(col.id)).map((column) => (
                <TableCell key={column.id}><Skeleton className="h-4 w-full max-w-[200px]" /></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      );
    }
    if (allVisibleRows.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={visibleColumns.size + 1} className="text-center py-8">
              <div className="text-muted-foreground">
                {state.filters.search || state.filters.role || state.filters.status
                  ? 'No users found matching your filters.'
                  : 'No users found.'}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    return (
      <TableBody>
        {allVisibleRows.map((user) => (
          <TableRow key={user.id} className="hover:bg-muted/50">
            <TableCell className="w-10 text-center">
              <input
                type="checkbox"
                aria-label={`Select row for ${user.full_name}`}
                checked={selectedRowIds.has(user.id)}
                onChange={() => handleSelectRow(user.id)}
              />
            </TableCell>
            {userTableColumns.filter(col => visibleColumns.has(col.id)).map((column) => {
              if (column.id === 'role') {
                let roleLabel = '';
                switch (user.role) {
                  case 'admin': roleLabel = 'Admin'; break;
                  case 'onboarding-officer': roleLabel = 'KYC Officer'; break;
                  case 'investor': default: roleLabel = 'Investor';
                }
                return (
                  <TableCell key={column.id}>
                    <span className="text-xs font-medium text-gray-900">{roleLabel}</span>
                  </TableCell>
                );
              }
              if (column.id === 'status') {
                let statusLabel = '';
                let statusClass = '';
                switch (user.status) {
                  case 'active': statusLabel = 'Active'; statusClass = 'bg-green-100 text-green-800'; break;
                  case 'inactive': statusLabel = 'Inactive'; statusClass = 'bg-gray-100 text-gray-500'; break;
                  case 'suspended': statusLabel = 'Suspended'; statusClass = 'bg-yellow-100 text-yellow-800'; break;
                  default: statusLabel = user.status ?? ''; statusClass = 'bg-gray-100 text-gray-500';
                }
                return (
                  <TableCell key={column.id}>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusClass}`}>{statusLabel}</span>
                  </TableCell>
                );
              }
              return (
                <TableCell key={column.id}>
                  {column.cell ? (
                    column.cell({ row: { original: user } })
                  ) : (
                    <span>{user[column.accessorKey as keyof UserProfile] as string}</span>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  // Helper to render the summary/pagination text
  function renderPaginationSummary({ data, pagination, loading, error }: {
    data: UserProfile[];
    pagination: TableState['pagination'];
    loading: boolean;
    error: string | null;
  }) {
    if (loading) return <span>Loading users...</span>;
    if (error) return <span className="text-red-500">Failed to load users.</span>;
    if (!data || data.length === 0) return null;

    const totalUsers = typeof pagination?.totalUsers === 'number' ? pagination.totalUsers : data.length;
    if (totalUsers === 0) return null;

    // Always use backend-provided from/to if present, else fallback
    let from = typeof pagination.from === 'number' && pagination.from > 0 ? pagination.from : ((pagination.currentPage - 1) * pagination.perPage + 1);
    let to = typeof pagination.to === 'number' && pagination.to >= from ? pagination.to : (from + data.length - 1);
    if (from > to) return null;

    return (
      <span>
        {`Showing ${from} to ${to} of ${totalUsers} users`}
      </span>
    );
  }

  // Pagination summary
  function renderPagination() {
    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-2 text-sm text-gray-600 border-t bg-gray-50 gap-2 md:gap-0">
        {/* Pagination summary */}
        <div>{renderPaginationSummary({
          data: state.data,
          pagination: state.pagination,
          loading: state.loading,
          error: state.error,
        })}</div>
        {/* Per-page selector and controls */}
        <div className="flex items-center space-x-4">
          <label htmlFor="per-page" className="mr-2">Rows per page:</label>
          <select
            id="per-page"
            className="border rounded px-2 py-1 bg-white text-gray-700"
            value={state.pagination.perPage}
            onChange={e => {
              const newPerPage = Number(e.target.value);
              setState(prev => ({
                ...prev,
                pagination: { ...prev.pagination, perPage: newPerPage, currentPage: 1 }
              }));
            }}
          >
            {[5, 10, 20, 50, 100].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Page controls */}
          <button
            className="ml-2 px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(state.pagination.currentPage - 1)}
            disabled={state.pagination.currentPage <= 1 || state.loading}
          >
            Previous
          </button>
          <span className="mx-2">Page {state.pagination.currentPage} of {state.pagination.totalPages}</span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => handlePageChange(state.pagination.currentPage + 1)}
            disabled={state.pagination.currentPage >= state.pagination.totalPages || state.loading}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // --- UI: Filter Toggle, Column Toggle, and Summary ---
  return (
    <div className="space-y-4">
      {/* Top controls: filter toggle, summary, column toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Row filter toggle group */}
          <div className="flex items-center gap-1 border rounded px-2 py-1 bg-gray-50">
            <label className="text-xs font-medium">Show:</label>
            <Button size="sm" variant={rowFilter === 'all' ? 'default' : 'ghost'} onClick={() => setRowFilter('all')}>All</Button>
            <Button size="sm" variant={rowFilter === 'selected' ? 'default' : 'ghost'} onClick={() => setRowFilter('selected')}>Selected</Button>
            <Button size="sm" variant={rowFilter === 'unselected' ? 'default' : 'ghost'} onClick={() => setRowFilter('unselected')}>Unselected</Button>
          </div>
          {/* Selection summary */}
          <span className="text-xs text-muted-foreground ml-2">{selectedRowIds.size} of {state.data.length} row(s) selected</span>
        </div>
        {/* Column toggle dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
              <ChevronDown className="h-4 w-4 mr-1" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {userTableColumns.filter(col => col.id !== 'actions').map(col => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={visibleColumns.has(col.id)}
                disabled={visibleColumns.size === 1 && visibleColumns.has(col.id)}
                onCheckedChange={() => handleToggleColumn(col.id)}
              >
                {col.header && typeof col.header !== 'function' ? col.header : col.id.charAt(0).toUpperCase() + col.id.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Error alert */}
      {state.error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{state.error}</AlertDescription>
        </Alert>
      )}
      {/* Table and pagination */}
      <div className="rounded-md border bg-white">
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
        {renderPagination()}
      </div>
    </div>
  );
}
