import { updateEmail } from "firebase/auth";

export default async function emailUpdate(user, newPassword) {
    let result = null,
    error = null;
    try {
        result = await updateEmail(user, newPassword);
    } catch (e) {
        error = e;
    }

    return { result, error };
}