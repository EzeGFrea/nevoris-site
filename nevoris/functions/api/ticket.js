export async function onRequestPost({ request }) {

const form = await request.formData()

const honeypot = form.get("empresa_web")

// BLOQUEO BOT
if (honeypot) {
return new Response("Spam detectado",{status:403})
}

const empresa = form.get("empresa")
const nombre = form.get("nombre")
const email = form.get("email")
const tipo = form.get("tipo")
const prioridad = form.get("prioridad")
const descripcion = form.get("descripcion")

const subject = `[TICKET][${prioridad}] ${empresa} - ${tipo}`

const body = `

Empresa: ${empresa}

Solicitante: ${nombre}

Email: ${email}

Tipo de problema: ${tipo}

Prioridad: ${prioridad}

Descripción:
${descripcion}

`

await fetch("https://api.mailchannels.net/tx/v1/send", {

method: "POST",

headers: {
"content-type": "application/json"
},

body: JSON.stringify({

personalizations: [
{
to: [{ email: "soporte@nevoris.com.ar" }]
}
],

from: {
email: "tickets@nevoris.com.ar",
name: "Nevoris Support"
},

reply_to: {
email: email
},

subject: subject,

content: [
{
type: "text/plain",
value: body
}
]

})

})

return new Response("✅ Ticket enviado correctamente. Nuestro equipo lo revisará.")

}