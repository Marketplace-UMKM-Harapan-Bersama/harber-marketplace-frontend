"use client";

import { useAuth } from "@/hooks/use-auth";
import * as React from "react";

import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SellerDetail() {
  const { user } = useAuth();
  const [showSecret, setShowSecret] = React.useState(false);

  const seller = user?.role === "seller" ? user?.seller : null;

  if (!seller) return null;

  return (
    <Card>
        <CardHeader>
          <CardTitle>Client Credentials</CardTitle>
          <CardDescription>Tambahkan client_id dan client_secret pada toko online Anda agar data dapat tersinkronisasi dengan sistem kami.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client ID */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Client ID</label>
                <input
                    value={seller.client_id || "Tidak tersedia"}
                    readOnly
                    className="w-full mt-1 px-3 py-2 border rounded bg-gray-100 text-sm text-gray-900"
                />
                </div>

                {/* Client Secret */}
                <div>
                <label className="block text-sm font-medium text-gray-700">Client Secret</label>
                <div className="relative">
                    <input
                    type={showSecret ? "text" : "password"}
                    value={seller.client_secret || "Tidak tersedia"}
                    readOnly
                    className="w-full mt-1 px-3 py-2 border rounded bg-gray-100 text-sm text-gray-900 pr-10"
                    />
                    <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-800"
                    >
                    {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
