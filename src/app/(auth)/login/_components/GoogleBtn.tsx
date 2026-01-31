"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function GoogleBtn() {
    const router = useRouter();

    return (
        <GoogleLogin
            onSuccess={(res) => {
                fetch("http://localhost:4000/api/v1/auth/oauth/google", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        idToken: res.credential,
                    }),
                })
                    .then((r) => r.json())
                    .then((data) => {
                        console.log(data);
                        router.push("/profile");
                    });
            }}
            onError={() => console.log("Login Failed")}
        />
    );
}
