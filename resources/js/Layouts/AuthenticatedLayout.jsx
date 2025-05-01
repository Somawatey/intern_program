import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [visibleLinks, setVisibleLinks] = useState([]);
    
    const isAdmin = user?.roles?.includes('admin');
    const isStaff = user?.roles?.includes('staff');

    // Define base navigation links
    const navigationLinks = [
        { 
            name: 'Dashboard', 
            route: 'dashboard',
            href: route('dashboard'),
            pattern: 'dashboard',

        },
    ];

    // Define admin-specific links
    const adminLinks = [
        { 
            name: 'Users', 
            route: 'users.index',
            href: route('users.index'),
            pattern: 'users.*',
            permission: 'manage users' 
        },
        { 
            name: 'Roles', 
            route: 'roles.index',
            href: route('roles.index'),
            pattern: 'roles.*',
            permission: 'manage roles' 
        },
        { 
            name: 'Permissions', 
            route: 'permissions.index',
            href: route('permissions.index'),
            pattern: 'permissions.*',
            permission: 'manage permissions' 
        },
        { 
            name: 'Students', 
            route: 'studentsdashboard.index',
            href: route('studentsdashboard.index'),
            pattern: 'studentsdashboard.*',
            permission: 'view students' 
        },
    ];

    // Define staff-specific links
    const staffLinks = [
        { 
            name: 'Students', 
            route: 'studentsdashboard.index',
            href: route('studentsdashboard.index'),
            pattern: 'studentsdashboard.*',
            permission: 'view students'
        },
    ];

    useEffect(() => {
        // Get visible links based on user role and permissions
        const links = [...navigationLinks];
        
        if (isStaff) {
            const authorizedStaffLinks = staffLinks.filter(link => 
                user.permissions?.includes(link.permission)
            );
            links.push(...authorizedStaffLinks);
        }
        
        if (isAdmin) {
            const authorizedAdminLinks = adminLinks.filter(link => 
                user.permissions?.includes(link.permission)
            );
            links.push(...authorizedAdminLinks);
        }
        
        setVisibleLinks(links);
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('dashboard')}>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {visibleLinks.map(link => (
                                    <NavLink
                                        key={link.route}
                                        href={link.href}
                                        active={route().current(link.pattern)}
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                                            <div className="font-medium text-gray-800">{user.name}</div>
                                            <div className="text-xs mt-1">
                                                Role: {isAdmin ? 'Administrator' : (isStaff ? 'Staff' : 'User')}
                                            </div>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="space-y-1 pb-3 pt-2">
                        {visibleLinks.map(link => (
                            <ResponsiveNavLink
                                key={link.route}
                                href={link.href}
                                active={route().current(link.pattern)}
                            >
                                {link.name}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            <div className="text-xs font-medium text-blue-600 mt-1">
                                {isAdmin ? 'Administrator' : (isStaff ? 'Staff' : 'User')}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Heading */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>
        </div>
    );
}