import DialogCustom from '@/components/DialogCustom';
import Loader from '@/components/Loader';
import { Spinner } from '@chakra-ui/react';
import React from 'react';

function loading() {
  return (
    <DialogCustom
      className="w-[90%] lg:w-[50%] h-fit items-center justify-center rounded-lg"
      isModalOpen={true}
      notShowClose={true}
    >
      <div className="flex flex-col gap-3 items-center justify-center">
        <Spinner
          className="w-full h-full flex justify-center items-center"
          color="cyan"
        />
        <div className="text-center font-semibold text-xs sm:text-sm text-blue-300">
          Loading
        </div>
      </div>
    </DialogCustom>
  );
}

export default loading;
