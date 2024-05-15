'use client';

import * as React from 'react';
import { Flex, Center, Text, Avatar, ScaleFade, Icon } from '@chakra-ui/react';
import { cn } from '@/lib/utils';
import { Icons } from '@/assets/Icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'username is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});
const Login = ({ className }: { className?: string; providers: unknown }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [show, setShow] = React.useState({
    showPass: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  async function onSubmit(data) {
    console.log(data);

    setIsLoading(true);
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });
    setIsLoading(false);

    if (res?.error) {
      toast.error(res?.error);

      return;
    }

    console.log(res);
    if (!res?.error) router.refresh();
    setIsLoading(false);
    console.log(res);
  }
  if (isLoading)
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <div className="flex flex-row grow  gap-4">
      {/* Left */}
      {/* <div className="h-[100%] w-[100%] lg:w-1/2 overflow-auto">
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className={cn(
              'grid gap-6 w-[80%] md:w-[70%] lg:w-[60%] ',
              className
            )}
          >
            <div className="w-full justify-center align-middle">
              <Avatar
                key={`Lee-avatar`}
                mr={2}
                src={`https://api.dicebear.com/5.x/big-smile/svg?seed=Lee`}
                size="lg"
              ></Avatar>
            </div>
            <div className="flex flex-row gap-2">
              <span className="basis-1/4">Username: </span>
              <input
                className=" basis-3/4 p-2 text-black rounded-md "
                placeholder="boby"
              ></input>
            </div>
            <div className="flex flex-row gap-2">
              <span className="basis-1/4">Game Code: </span>
              <input
                className="p-2 text-black rounded-md basis-3/4"
                placeholder="SJKHNQ"
              ></input>
            </div>
            <Button onClick={() => router.push('game/1')}>Join Game</Button>
          </div>
        </div>
      </div> */}
      <div className="h-[100%] w-[100%] lg:w-1/2 overflow-auto">
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className={cn(
              'grid gap-6 w-[80%] md:w-[70%] lg:w-[60%] ',
              className
            )}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="gap-8 flex flex-col">
                    <div className="flex flex-col gap-3 ">
                      <Label className=" self-start">Tài khoản</Label>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên đăng nhập"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3 ">
                      <Label className=" self-start">Mật khẩu</Label>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                renderRight={
                                  <div
                                    onClick={() => {
                                      setShow({
                                        ...show,
                                        showPass: !show.showPass,
                                      });
                                    }}
                                    className="opacity-50 cursor-pointer hover:opacity-100"
                                  >
                                    {show.showPass ? (
                                      <AiFillEyeInvisible size={20} />
                                    ) : (
                                      <AiFillEye size={20} />
                                    )}
                                  </div>
                                }
                                value={field.value}
                                onChange={field.onChange}
                                id="password"
                                placeholder="Nhập mật khẩu"
                                type={show.showPass ? 'text' : 'password'}
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect="off"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit">Đăng nhập</Button>
                </div>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Hoặc có thể tiếp tục với
                </span>
              </div>
            </div>
            <div className="w-full flex gap-6">
              <Button
                className="w-1/2 "
                onClick={() => {
                  // signIn('github');
                }}
                variant="outline"
                disabled={isLoading}
              >
                <div>
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                </div>{' '}
                Github
              </Button>
              <Button
                className="w-1/2"
                onClick={() => {
                  // signIn('discord');
                }}
                variant="outline"
                disabled={isLoading}
              >
                <div>
                  <Icons.discord className="mr-2 h-4 w-4" />
                </div>{' '}
                Discord
              </Button>
              <Button
                className="w-1/2"
                onClick={() => {
                  // signIn('google');
                }}
                variant="outline"
                disabled={isLoading}
              >
                <div>
                  <Icons.google className="mr-2 h-4 w-4" />
                </div>{' '}
                Google
              </Button>
            </div>
          </div>

          <p className="mt-5 px-8 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link
              className="font-bold underline text-black"
              href="/auth/register"
            >
              Đăng ký
            </Link>
          </p>
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
