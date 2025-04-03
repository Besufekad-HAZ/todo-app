import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';

export function MobileSidebar({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <Dialog as="div" className="md:hidden fixed inset-0 z-50" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-y-0 left-0 w-64 shadow-lg"
        style={{ backgroundColor: 'rgb(var(--color-sidebar-bg))' }}
      >
        <Dialog.Panel className="h-full overflow-y-auto">{children}</Dialog.Panel>
      </div>
    </Dialog>
  );
}
