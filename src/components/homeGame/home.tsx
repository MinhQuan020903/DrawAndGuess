'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { signOut } from 'next-auth/react';

const HomeComponent = ({ className, session }: any) => {
  console.log('🚀 ~ HomeComponent ~ session:', session);

  return (
    <div className="flex flex-row grow  gap-4">
      <div className="h-[100%] w-[100%]  overflow-auto">
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className={cn(
              'grid gap-6 w-[80%] md:w-[70%] lg:w-[60%] ',
              className
            )}
          ></div>

          <div className="w-full justify-center align-middle">
            {session?.user.display_name}
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="border-solid border-t-2 mt-2  gap-2"
          >
            Đăng xuất
          </Button>
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
