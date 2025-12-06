'use client';

import React from 'react';
import { Gamepad2Icon, MenuIcon, LogOutIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { logoutAction } from '@/lib/auth-actions';

interface FloatingHeaderProps {
	isAuthenticated?: boolean;
	username?: string;
	isAdmin?: boolean;
}

export function FloatingHeader({ isAuthenticated = false, username, isAdmin = false }: FloatingHeaderProps) {
	const [open, setOpen] = React.useState(false);

	const handleLogout = async () => {
		await logoutAction();
	};

	const links = [
		{
			label: 'Dashboard',
			href: '/dashboard',
		},
		{
			label: 'Matches',
			href: '/matches',
		},
		{
			label: 'Teams',
			href: '/teams',
		},
		{
			label: 'Profile',
			href: '/profile',
		},
		...(isAdmin ? [{
			label: 'Admin',
			href: '/admin',
		}] : []),
	];

	return (
		<div className="fixed top-0 left-0 right-0 z-[100] pt-4 px-4">
			<header
				className={cn(
					'mx-auto w-full max-w-3xl rounded-lg border shadow',
					'bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg',
				)}
			>
			<nav className="mx-auto flex items-center justify-between p-1.5">
				<Link href="/" className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 duration-100">
					<Gamepad2Icon className="size-5" />
					<p className="font-mono text-base font-bold">Esports Bet</p>
				</Link>
				<div className="hidden items-center gap-1 lg:flex">
					{links.map((link) => (
						<Link
							key={link.label}
							className={buttonVariants({ variant: 'ghost', size: 'sm' })}
							href={link.href}
						>
							{link.label}
						</Link>
					))}
				</div>
				<div className="flex items-center gap-2">
					{isAuthenticated ? (
						<>
							<span className="hidden lg:block text-sm text-muted-foreground">
								{username}
							</span>
							<Button 
								size="sm" 
								variant="destructive"
								onClick={handleLogout}
								className="bg-red-600 hover:bg-red-700 text-white"
							>
								<LogOutIcon className="size-4 mr-1" />
								Logout
							</Button>
						</>
					) : (
						<>
							<Link href="/login">
								<Button size="sm" variant="ghost">Login</Button>
							</Link>
							<Link href="/signup" className="hidden lg:block">
								<Button size="sm">Sign Up</Button>
							</Link>
						</>
					)}
					<Sheet open={open} onOpenChange={setOpen}>
						<Button
							size="icon"
							variant="outline"
							onClick={() => setOpen(!open)}
							className="lg:hidden"
						>
							<MenuIcon className="size-4" />
						</Button>
						<SheetContent
							className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
							showClose={false}
							side="left"
						>
							<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
								{links.map((link) => (
									<Link
										key={link.label}
										className={buttonVariants({
											variant: 'ghost',
											className: 'justify-start',
										})}
										href={link.href}
										onClick={() => setOpen(false)}
									>
										{link.label}
									</Link>
								))}
							</div>
							<SheetFooter>
								{isAuthenticated ? (
									<Button 
										variant="destructive" 
										className="w-full bg-red-600 hover:bg-red-700"
										onClick={() => {
											setOpen(false);
											handleLogout();
										}}
									>
										<LogOutIcon className="size-4 mr-2" />
										Logout
									</Button>
								) : (
									<>
										<Link href="/login" className="w-full">
											<Button variant="outline" className="w-full">Login</Button>
										</Link>
										<Link href="/signup" className="w-full">
											<Button className="w-full">Sign Up</Button>
										</Link>
									</>
								)}
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
		</div>
	);
}
