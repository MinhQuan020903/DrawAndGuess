'use client';
import React from 'react';

const GameEnd: React.FC = () => {
  return (
    <section className="container d-none" id="gameEnded">
      <div className="row justify-content-center mx-0">
        <div
          className="col-lg-8 col-xl-6 bg-white rounded p-3 pt-0"
          id="statsDiv"
        >
          <h1 className="text-center display-5 py-5 fw-bold bg-white sticky-top">
            Final Scores
          </h1>
        </div>
      </div>
    </section>
  );
};

export default GameEnd;
