import React, { memo } from 'react';
import { 
  ClipboardDocumentListIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const EmptyState = memo(({ 
  type = 'default',
  title,
  description,
  action,
  icon: CustomIcon
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'tasks':
        return {
          icon: ClipboardDocumentListIcon,
          title: 'No tasks found',
          description: 'Create your first construction task to get started with project management.',
          actionText: 'Create Task'
        };
      case 'users':
        return {
          icon: UserIcon,
          title: 'No users registered',
          description: 'Users will appear here once they register for an account.',
          actionText: null
        };
      case 'search':
        return {
          icon: MagnifyingGlassIcon,
          title: 'No results found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
          actionText: null
        };
      case 'filter':
        return {
          icon: FunnelIcon,
          title: 'No items match your filters',
          description: 'Try adjusting your filter criteria to see more results.',
          actionText: 'Clear Filters'
        };
      default:
        return {
          icon: ClipboardDocumentListIcon,
          title: 'Nothing here yet',
          description: 'Items will appear here once available.',
          actionText: null
        };
    }
  };

  const content = getDefaultContent();
  const Icon = CustomIcon || content.icon;

  return (
    <div className="text-center py-12 px-4">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-primary bg-opacity-10 rounded-full blur-2xl"></div>
          <div className="relative p-4 bg-bg-secondary rounded-full border border-border-light">
            <Icon className="h-12 w-12 text-text-muted" />
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title || content.title}
      </h3>
      
      <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
        {description || content.description}
      </p>
      
      {(action || content.actionText) && (
        <div className="flex justify-center">
          {action || (
            <button className="btn btn-primary">
              {content.actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
