import { getAuth, updatePassword } from "firebase/auth";

export default async function passwordUpdate(user, newPassword) {
    let result = null,
    error = null;
    try {
        result = await updatePassword(user, newPassword);
    } catch (e) {
        error = e;
    }

    return { result, error };
}