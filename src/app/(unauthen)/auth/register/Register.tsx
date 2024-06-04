'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DialogCustom from '@/components/DialogCustom';
import { Button, Spinner } from '@chakra-ui/react';

const registerSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm Password must be at least 6 characters' }),
    displayName: z.string().min(1, { message: 'Display name is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
const Register = ({ className }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [show, setShow] = React.useState({
    showPass: false,
    showConfirmPass: false,
  });

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await fetch('http://localhost:8081/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        role: 'USER',
        display_name: data.displayName,
      }),
    });

    setIsLoading(false);
    if (response.ok) {
      toast.success('Registration successful');
      router.push('/auth/login');
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || 'Registration failed');
    }
  };

  if (isLoading) {
    return (
      <DialogCustom
        className="w-[90%] lg:w-[50%] h-fit items-center justify-center rounded-lg"
        isModalOpen={isLoading}
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

  return (
    <div className="h-full w-full overflow-auto flex flex-col items-center justify-center">
      <div className={cn('grid gap-6 w-4/5 md:w-3/5 lg:w-2/5', className)}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex text-black flex-col gap-3">
                <Label className=" self-start">Username</Label>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="border-black border-2">
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex text-black flex-col gap-3">
                <Label className=" self-start">Password</Label>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="border-black border-2">
                        <Input
                          type={show.showPass ? 'text' : 'password'}
                          placeholder="Password"
                          {...field}
                          renderRight={
                            <div
                              onClick={() =>
                                setShow((prev) => ({
                                  ...prev,
                                  showPass: !prev.showPass,
                                }))
                              }
                              className="opacity-50 cursor-pointer hover:opacity-100"
                            >
                              {show.showPass ? (
                                <AiFillEyeInvisible size={20} />
                              ) : (
                                <AiFillEye size={20} />
                              )}
                            </div>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex text-black flex-col gap-3">
                <Label className=" self-start">Confirm Password</Label>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="border-black border-2">
                        <Input
                          type={show.showConfirmPass ? 'text' : 'password'}
                          placeholder="Confirm Password"
                          {...field}
                          renderRight={
                            <div
                              onClick={() =>
                                setShow((prev) => ({
                                  ...prev,
                                  showConfirmPass: !prev.showConfirmPass,
                                }))
                              }
                              className="opacity-50 cursor-pointer hover:opacity-100"
                            >
                              {show.showConfirmPass ? (
                                <AiFillEyeInvisible size={20} />
                              ) : (
                                <AiFillEye size={20} />
                              )}
                            </div>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex text-black flex-col gap-3">
                <Label className=" self-start">Display Name</Label>
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="border-black border-2">
                        <Input placeholder="Display Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                shadow={'outline'}
                dropShadow={'outline'}
                bgColor={'blue.600'}
                fontWeight={'bold'}
                rounded={'xl'}
                _hover={{
                  borderColor: 'slate.300',
                  bgColor: 'blue.500',
                }}
                textColor={'white'}
                type="submit"
              >
                Register
              </Button>
            </div>
          </form>
        </Form>
        <p className="w-full my-4 flex flex-row gap-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link className="font-bold underline text-black" href="/auth/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
