import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { HiChevronDoubleRight } from 'react-icons/hi';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-8">
      <ol className="flex items-center flex-wrap gap-y-1 font-jakarta text-sm">
        {/* Accueil */}
        <li>
          <Link
            to="/"
            className="flex items-center text-nemo-dark-bg/40 dark:text-nemo-dark-muted hover:text-nemo-orange dark:hover:text-nemo-orange transition-colors"
            aria-label="Accueil"
          >
            <Home size={15} aria-hidden="true" />
          </Link>
        </li>

        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-x-1">
              <HiChevronDoubleRight
                size={12}
                className="text-nemo-dark-bg/25 dark:text-nemo-dark-muted/50 mx-1 shrink-0"
                aria-hidden="true"
              />
              {isLast || !crumb.href ? (
                <span
                  className="text-nemo-dark-bg dark:text-nemo-dark-text font-semibold"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="text-nemo-dark-bg/40 dark:text-nemo-dark-muted hover:text-nemo-orange dark:hover:text-nemo-orange transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
