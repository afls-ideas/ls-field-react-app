import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Boxes, CalendarDays, ClipboardList, HelpCircle, LayoutDashboard, Phone, Pill, Users } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/accounts', label: 'Accounts', icon: Users, end: false },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, end: false },
  { to: '/inquiries', label: 'Inquiries', icon: HelpCircle, end: false },
  { to: '/visits', label: 'Visits', icon: Phone, end: false },
  { to: '/inventory', label: 'Inventory', icon: Boxes, end: false },
  { to: '/samples', label: 'Samples', icon: Pill, end: false },
] as const;

export default function AppLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRef<string | null>(null);

  // Move focus to the page content after client-side navigation.
  useEffect(() => {
    if (
      previousPathname.current !== null &&
      previousPathname.current !== location.pathname
    ) {
      const wrapper = mainRef.current;
      const target =
        wrapper?.querySelector<HTMLElement>('h1, main, [role="main"]') ??
        wrapper;
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus();
      }
    }
    previousPathname.current = location.pathname;
  }, [location.pathname]);

  return (
    <>
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          const content = mainRef.current;
          if (content) {
            if (!content.hasAttribute('tabindex')) content.setAttribute('tabindex', '-1');
            content.focus();
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:shadow focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <ClipboardList className="size-5" />
            </span>
            <span className="font-display text-xl font-semibold text-primary">
              Field Ledger
            </span>
          </NavLink>
          <nav aria-label="Primary" className="flex gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <div id="main-content" ref={mainRef} className="outline-none">
        <Outlet />
      </div>
      <Toaster />
      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground sm:px-6 lg:px-8">
        Live data from Salesforce Visit and ProductDisbursement records.
      </footer>
    </>
  );
}
