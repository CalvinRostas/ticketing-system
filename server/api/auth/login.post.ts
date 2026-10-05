import z, { treeifyError } from "zod"
import { loginSchema } from "../../schemas/auth.schema"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsedBody = loginSchema.safeParse(body)

    if (!parsedBody.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.invalidLogin",
            data: treeifyError(parsedBody.error)
        })
    }

    const checkUser = await prisma.users.findUnique({
        where: {
            email: parsedBody.data.email,
            isDeleted: false
        }
    })

    if (!checkUser) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.noAccountFound"
        })
    }

    const checkPassword = await verifyPassword(checkUser.password, parsedBody.data.password)

    if (!checkPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: "error.invalidLogin"
        })
    }

    await setUserSession(event, {
        user: checkUser
    })

    return await getUserSession(event)
})