'use client';
import React from 'react';
import Tools from './tools';

const GameZone: React.FC = () => {
  return (
    <section className="container-md d-none" id="gameZone">
      <div className="alert alert-info py-2 rounded-0" role="alert">
        <div className="row align-items-center">
          <div className="col-2">
            <p className="lead fw-bold mb-0" id="clock">
              0
            </p>
          </div>
          <div className="col-10 col-md-8 text-center" id="wordDiv"></div>
        </div>
      </div>
      <div className="row justify-content-center mx-0">
        <div className="col-3 col-lg-2 h-100 players"></div>
        <div className="col-9 col-lg-7 h-100 d-flex flex-column pe-0 px-lg-3">
          <div id="sketchpad" className="text-end"></div>
          {/* Komponen Tools */}
          <Tools />
        </div>
        <div className="col-lg-3 h-100 bg-white p-0 mt-3 mt-lg-0">
          <div className="messages"></div>
          <form id="sendMessage" className="m-2">
            <input
              className="form-control"
              type="text"
              placeholder="Type your guess here..."
            />
            <div className="position-relative">
              <ul className="list-group mt-1" id="suggestions"></ul>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GameZone;
