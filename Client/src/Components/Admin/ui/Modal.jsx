import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { FiX } from 'react-icons/fi';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className={twMerge(
          "fixed inset-0 bg-black bg-opacity-50 transition-opacity",
          overlayClassName
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className={twMerge(
            "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  closeOnOverlayClick: PropTypes.bool,
};

export default Modal;