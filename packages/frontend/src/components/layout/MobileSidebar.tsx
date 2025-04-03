// import { useEffect } from 'react';
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
  return (
    <Dialog as="div" className="md:hidden fixed inset-0 z-50" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-y-0 left-0 w-64 shadow-xl">
        <Dialog.Panel className="h-full overflow-y-auto bg-sidebar-bg text-sidebar-text">
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
