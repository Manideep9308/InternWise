
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Logo } from './logo';
import { Briefcase, Bot, User, Menu, X, LogIn, UserCheck, LayoutDashboard, ClipboardList, TrendingUp } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/internships', label: 'Internships', icon: Briefcase },
  { href: '/ai-coach', label: 'AI Coach', icon: Bot },
  { href: '/hiring-manager-simulator', label: 'Resume Review', icon: UserCheck },
  { href: '/career-path-simulator', label: 'Career Path', icon: TrendingUp },
  { href: '/my-applications', label: 'Applications', icon: ClipboardList },
  { href: '/profile', label: 'Profile', icon: User },
];

const employerLinks = [
    { href: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/post-internship', label: 'Post Internship', icon: Briefcase },
];


export function Header() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // More robust check for employer pages
    const employerPaths = ['/employer', '/post-internship'];
    const isEmployerPath = employerPaths.some(p => pathname.startsWith(p)) || pathname.includes('/internships/') && pathname.includes('/applicants');
    setIsEmployer(isEmployerPath);
  }, [pathname]);

  const NavLink = ({ href, label, icon: Icon }: typeof navLinks[0]) => (
    <Link href={href} passHref>
      <Button variant="ghost" className={cn(
        'justify-start gap-2',
        pathname === href ? 'bg-primary/10 text-primary' : ''
      )}>
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );

  const NavLinkMobile = ({ href, label, icon: Icon }: typeof navLinks[0]) => (
    <SheetClose asChild>
      <Link href={href} passHref>
        <Button variant="ghost" className={cn(
          'w-full justify-start gap-3 text-lg py-6',
          pathname === href ? 'bg-primary/10 text-primary' : ''
        )}>
          <Icon className="h-5 w-5" />
          {label}
        </Button>
      </Link>
    </SheetClose>
  );

  const activeLinks = isEmployer ? employerLinks : navLinks;

  if (!isMounted) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                </Link>
                 <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
            </div>
        </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
        {activeLinks.map((link) => (
            <NavLink key={link.href} {...link} />
        ))}
        <Separator orientation="vertical" className="h-6 mx-2"/>
        <Link href="/login" passHref>
            <Button variant="outline">Login</Button>
        </Link>
        <Link href="/signup" passHref>
            <Button>Sign Up</Button>
        </Link>
        </nav>
        <div className="md:hidden">
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
                <Menu />
            </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[320px] p-0">
            <div className="p-4 flex justify-between items-center border-b">
                <Link href="/" passHref>
                    <SheetClose>
                        <Logo />
                    </SheetClose>
                </Link>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                        <X />
                    </Button>
                </SheetClose>
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-2">
                {activeLinks.map((link) => (
                    <NavLinkMobile key={link.href} {...link} />
                ))}
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                <SheetClose asChild>
                    <Link href="/login" passHref>
                        <Button variant="outline" className="w-full">
                            <LogIn className="mr-2" />
                            Login
                        </Button>
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Link href="/signup" passHref>
                        <Button className="w-full">
                            Sign Up
                        </Button>
                    </Link>
                </SheetClose>
                </div>
            </div>
            </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}
