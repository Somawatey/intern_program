import React from "react";
import {usePage} from "@inertiajs/react";
export default function Layout({children}) {
    const { flash } = usePage().props
    return (
        <div>
            {flash.success && (
                <div className="alert bg-green-200 px-4 py-6">{flash.success}</div>
            )}
            {children}
        </div>
    )
}