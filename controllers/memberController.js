import database from "../service/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getAllMember(req, res) {

  console.log(`GET / members is requested`);

  try {
    const strQry = "SELECT * FROM members";
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function registMember(req, res) {
  console.log(`POST / Register Members is requested`);
  try {

    if (req.body.memEmail == null || req.body.memName == null) {
      // return res.status(422).json({ error: "Email and Username is requied." });
      return res.json({regist : false})
    }

    const existsResult = await database.query({
      text: `SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)`,
      values: [req.body.memEmail],
    });
    
    if (existsResult.rows[0].exists) {
      return res.json({regist : false , message : `Username : ${req.body.memEmail} is Exists.`})
    }

    const pwd = req.body.password;
    const saltround = 8;
    const pwdHash = await bcrypt.hash(pwd, saltround);

    const result = await database.query({
      text: `INSERT INTO members ("memEmail","memName","memHash","memPhone","memGender","memBirth") VALUES ($1,$2,$3,$4,$5,$6)`,
      values: [
        req.body.memEmail,
        req.body.memName,
        pwdHash,
        req.body.memPhone,
        req.body.memGender,
        req.body.memBirth,
      ],
    });

    const bodyDate = req.body;
    const datetime = new Date();
    bodyDate.createDate = datetime;
    return res.json({regist : true})

  } catch (err) {
    // return res.status(509).json({ error: err.message });
    return res.json({regist : false , message : err})
  }

}

export async function loginMember(req, res) {
  console.log(`POST / Login Members is requested`);
  try {
    if (req.body.memEmail == null || req.body.password == null) {
      // return res.status(422).json({ error: "Email and Username is required." });
      return res.json({login : false})
    }

    const existsResult = await database.query({
      text: `SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)`,
      values: [req.body.memEmail],
    });

    if (!existsResult.rows[0].exists) {
      // return res.status(400).json({ messagelogin: "Login fail." });
      return res.json({login : false})
    }

    const result = await database.query({
      text: `SELECT * FROM members WHERE "memEmail" = $1`,
      values: [req.body.memEmail],
    });

    const loginOK = await bcrypt.compare(req.body.password,result.rows[0].memHash)

    if(loginOK){
        // res.status(201).json({messagelogin : 'Login Success.'})'
        const user = {
          memEmail : result.rows[0].memEmail,
          memName : result.rows[0].memName,
        }
        const secret_key = process.env.SECRET_KEY
        const token = jwt.sign(user,secret_key,{expiresIn:'1h'})

        res.cookie('token',token , {
          maxAge: 3600000,
          secure: true,
          sameSite: "none"
        })
        return res.json({login : true})
    }

    else {
        // res.status(400).json({messagelogin : 'Login Fail.'})
        res.clearCookie('token',{
          secure : true,
          sameSite : "none"
        })
        return res.json({login : false})
    }

  } catch (err) {
    // res.status(500).json({ error: err.message });
    return res.json({login : false})
  }
}

export async function logoutMember(req, res) {
    console.log(`GET / Logout Members is Requested`);
    try {
      res.clearCookie('token',{
        maxAge : 0,
        secure : true,
        sameSite : "none"
      })
      res.json({login:false})
  
    } 
    catch (err) {   
      return res.json({err:err});
    }
  
}
