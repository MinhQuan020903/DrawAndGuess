'use client';
import React from 'react';

const colorClasses = [
  'white',
  'grey1',
  'red1',
  'orange1',
  'yellow1',
  'green1',
  'skyblue1',
  'blue1',
  'purple1',
  'pink1',
  'brown1',
  'black',
  'grey2',
  'red2',
  'orange2',
  'yellow2',
  'green2',
  'skyblue2',
  'blue2',
  'purple2',
  'pink2',
  'brown2',
];

const Tools: React.FC = () => {
  return (
    <div className="row mx-0 d-none" id="tools">
      <div className="col-2 col-xl-1 px-0">
        <div className="selected-color"></div>
      </div>
      <div className="col-10 text-end text-xl-start col-xl-5 px-0">
        <div className="d-inline-flex align-top">
          {colorClasses.slice(0, 11).map((colorClass, index) => (
            <div
              className={`color ${colorClass}`}
              role="button"
              key={index}
            ></div>
          ))}
        </div>
        <div className="d-inline-flex">
          {colorClasses.slice(11).map((colorClass, index) => (
            <div
              className={`color ${colorClass}`}
              role="button"
              key={index}
            ></div>
          ))}
        </div>
      </div>
      <div className="col-12 col-xl-6 text-center text-xl-end px-0">
        <img
          src="/images/brush-sm.png"
          id="sm-brush"
          data-linesize="5"
          role="button"
          alt="small brush"
        />
        <img
          src="/images/brush-md.png"
          id="md-brush"
          data-linesize="10"
          role="button"
          alt="medium brush"
        />
        <img
          src="/images/brush-lg.png"
          id="lg-brush"
          data-linesize="15"
          role="button"
          alt="large brush"
        />
        <img
          src="/images/brush-xl.png"
          id="xl-brush"
          data-linesize="20"
          role="button"
          alt="extra large brush"
        />
        <img
          src="/images/delete.png"
          id="clearCanvas"
          role="button"
          alt="clear canvas"
        />
      </div>
    </div>
  );
};

export default Tools;
