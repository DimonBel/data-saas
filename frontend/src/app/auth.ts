import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import userService from "@/app/services/user.service"


type SignInParams = {
    user: any;
    account: any;
    profile?: any;
};

async function signInUser({ user }: SignInParams): Promise<boolean> {
    try {
        await userService.register({
            username: user.name,
            email: user.email,
            password: "DODOIC123",
        });

        console.log(user.name)
        console.log(user.email)

        return true;
    } catch (error) {
        console.error('Error during user sign-in:', error);
        return false;
    }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID || "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET || "",

        }),
    ],
    callbacks: {
        signIn: signInUser,
        jwt: async ({ token }) => {
            return token;
        },
        session({ session, token }) {
            return session;
        }
    },

    pages: {
        error: "/unauthorized",
    }
});
