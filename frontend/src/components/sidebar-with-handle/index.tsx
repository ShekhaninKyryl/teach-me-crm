import { useState } from 'react';

//TODO: not completed
const SidebarWithHandle = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-full">
      {/* Сайдбар */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-accent-foreground transition-opacity shadow-lg transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4">Sidebar content</div>
      </div>

      {/* Handle */}
      <div
        onClick={() => setOpen(!open)}
        className={`fixed top-1/2 right-0 transform -translate-y-1/2 bg-sidebar  px-2 py-4 cursor-pointer
        ${open ? 'translate-x-0' : 'translate-x-4'}`}
      >
        {open ? '→' : '←'}
      </div>
    </div>
  );
};

export default SidebarWithHandle;
