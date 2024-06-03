'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
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
      username: 'minh_quan',
      password: 'quan2003',
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
    console.log('🚀 ~ onSubmit ~ res:', res);

    setIsLoading(false);
    if (res?.error) {
      toast.error(res?.error);

      return;
    } else {
      router.push('/');
    }
    if (!res?.error) router.refresh();
    setIsLoading(false);

    // router.push('/user');
  }
  if (isLoading)
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <div className="flex flex-row grow gap-4">
      <div className="h-[100%] w-[100%]  overflow-auto">
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
                    <div className="flex flex-col gap-3 text-black ">
                      <Label className=" self-start">Tài khoản</Label>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl className="border-black border-2">
                              <Input placeholder="minh_quan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3 text-black ">
                      <Label className=" self-start">Mật khẩu</Label>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl className="border-black border-2">
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
                                placeholder="quan2003"
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
