'use client';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed-bottom alert-secondary fw-bold">
      <div className="row p-1 align-items-center">
        <div className="col-4">
          Developed by{' '}
          <a
            href="https://github.com/Aditya-ds-1806"
            target="_blank"
            rel="noopener noreferrer"
            className="link-secondary"
          >
            Aditya D.S.
          </a>
        </div>
        <div className="col-4 text-center">
          Powered by{' '}
          <a
            href="https://socket.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/socket.io.png"
              className="align-text-bottom"
              width="20"
              alt="Socket.IO"
            />
          </a>
        </div>
        <div className="col-4 align-right text-end align-self-center">
          <a
            href="https://github.com/Aditya-ds-1806/Skribblrs.io"
            target="_blank"
            rel="noopener noreferrer"
            className="link-secondary"
          >
            View on GitHub{' '}
            <img
              src="/images/github.png"
              className="align-text-bottom"
              width="20"
              alt="GitHub"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
