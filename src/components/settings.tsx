'use client';
import React from 'react';

interface SettingsProps {
  roomID?: string;
}

const Settings: React.FC<SettingsProps> = ({ roomID }) => {
  const handleStartGame = () => {
    // Logic for starting the game
  };

  const handleCopyLink = () => {
    // Logic for copying the game link
  };

  return (
    <section className="container d-none" id="settings">
      <div className="row justify-content-between mx-0">
        <div className="col-md-6 order-2 order-md-0 bg-white rounded h-100 p-3">
          <h1 className="text-center">Settings</h1>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="rounds">
              Rounds
            </label>
            <select className="form-select" id="rounds">
              {/* Options for rounds */}
            </select>
          </div>
          {/* Additional input groups for settings */}
          {!roomID && <div />}
          <button
            className="btn btn-primary w-100"
            id="startGame"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
        <div className="col-md-6 text-white h-100 p-3">
          <h1 className="text-center">Players</h1>
          <div
            className="row mt-4 mx-0"
            style={{ height: '20em', overflowY: 'auto' }}
            id="playersDiv"
          ></div>
        </div>
      </div>
      <div className="mt-5">
        <h1 className="text-white text-center">Invite your friends!</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            id="gameLink"
            className="form-control text-center fw-bold bg-white"
            value="http://localhost:3000/"
            readOnly
          />
          <button
            className="btn btn-warning"
            type="button"
            id="copy"
            onClick={handleCopyLink}
          >
            Copy Link
          </button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
