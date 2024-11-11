const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

//lista de pacientes (se puede cambiar por una llamada a una BD)
let patients = new Object();
patients["111111111"] = ["john", "doe", "111-111-111"]
patients["111111112"] = ["harold", "alvarez", "111-111-112"]

//los historiales de los pacientes
let records = new Object();
records["111111111"] = "Status : Healthy"
records["111111112"] = "Status : Sick"

//index
app.get("/", (req, res) => {
    //status 200 = OK
    res.status(200).send("<h1>HOLA</h1>")
    //status 201 = OK
    //status 400 = NOT FOUND

});

//GET - historial de pacientes
app.get("/records", (req, res) => {
    //console.log(req.headers); //imprime la informacion del paciente en la consola mediante los parametros del header que pasamos a postman
    //console.log(req.headers.poliza); (poliza es el nombre 'KEY' que se pone en el header de postman)


    //verificar la existencia del paciente
    if (records[req.headers.poliza] === undefined) {
        res.status(404).send({ "msg": "No se encontro al paciente" });
        return;
    }

    //verificar la poliza del paciente
    if (req.headers.nombre == patients[req.headers.poliza][0]
        && req.headers.apellido == patients[req.headers.poliza][1]) {
        //en este caso el paciente si se encuentra en la BD

        //verificar que la razon por la que estas ingresando sea para obtener tu historial medico
        if (req.body.reasonforvisit === "medicalRecords") {
            //retornar historial medico
            res.status(200).send(records[req.headers.poliza]);
            return;
        }
        else {
            res.status(501).send({ "msg": "no es posible completar esta peticion por : " + req.body.reasonforvisit });
            return;
        }
    }
    else {
        res.status(401).send({ "msg": "nombre o apellido no coinciden" });
    }
    //devolver historial respectivo del paciente


    res.status(200).send({ "msg": "HTTP GET - SUCCESS!" })

});

//CREATE nuevo paciente
app.post("/new", (req, res) => {
    //console.log(req.headers.telefono);
    //crear paciente en la BD
    patients[req.headers.poliza] = [req.headers.nombre, req.headers.apellido, req.headers.telefono];
    res.status(200).send(patients) //imprime la lista de pacientes por pantalla
});

//UPDATE historial de paciente existente
app.put("/update", (req, res) => {

    //verificar la existencia del paciente
    if (records[req.headers.poliza] === undefined) {
        res.status(404).send({ "msg": "No se encontro al paciente" });
        return;
    }

    if (req.headers.nombre == patients[req.headers.poliza][0]
        && req.headers.apellido == patients[req.headers.poliza][1]) {
        //en este caso el paciente si se encuentra en la BD
        //actualizar el numero de telefono
        patients[req.headers.poliza] = [req.headers.nombre,req.headers.apellido,req.body.nuevoTelefono];
        res.status(202).send(patients[req.headers.poliza]);
        return;
    }
    else {
        res.status(401).send({ "msg": "nombre o apellido no coinciden. Intento de actualizar datos" });
    }

    res.status(200).send({ "msg": "HTTP PUT - SUCCESS!" })
});

//DELETE paciente existente
app.delete("/delete", (req, res) => {
    
    //verificar la existencia del paciente
    if (records[req.headers.poliza] === undefined) {
        res.status(404).send({ "msg": "No se encontro al paciente. Intento de borrado" });
        return;
    }

    //verificar la poliza del paciente
    if (req.headers.nombre == patients[req.headers.poliza][0]
        && req.headers.apellido == patients[req.headers.poliza][1]) {
        //en este caso el paciente si se encuentra en la BD
        delete patients[req.headers.poliza]
        delete records[req.headers.poliza]

        res.status(200).send({"msg":"poliza numero : "+req.headers.poliza+" ha sido borrada"});
    }
    else {
        res.status(401).send({ "msg": "nombre o apellido no coinciden. Intento de Borrado" });
    }


    res.status(200).send({ "msg": "HTTP DELETE - SUCCESS!" })
});


app.listen(3000);