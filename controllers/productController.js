import database from "../service/database.js";

export async function getAllProduct(req, res) {
    console.log(`GET / All products is Requested`);
    try {
        // const strQry = ' SELECT * FROM products ORDER BY "pdId" ASC';
        const result = await database.query(`
                                  SELECT p.*,(
                                    SELECT row_to_json(brand_obj)
                                    FROM 
                                    (
                                      SELECT "brandId","brandName"
                                      FROM brands
                                      WHERE "brandId" = p."brandId"
                                    )brand_obj
                                  )AS brand,
  
                                  (
                                    SELECT row_to_json(pdt_obj)
                                    FROM 
                                    (
                                      SELECT "pdTypeId","pdTypeName"
                                      FROM "pdTypes"
                                      WHERE "pdTypeId" = p."pdTypeId"
                                    )pdt_obj
                                  )AS pdt
                      FROM products p ORDER BY "pdId" ASC`);
        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}

export async function postProduct(req, res) {
    console.log(`POST / product is Requested`);
    try {
        //not null
        if (req.body.pdId == null || req.body.pdName == null) {
            return res.status(422).json({
                error: "pdId and pdName is required",
            });
        }

        const existsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM products WHERE "pdId" = $1)`,
            values: [req.body.pdId],
        });

        //unique key
        if (existsResult.rows[0].exists) {
            return res.status(409).json({
                error: `pdId : ${req.body.pdId} is Exists !!`,
            });
        }
        const result = await database.query({
            text: `INSERT INTO products ("pdId","pdName","pdPrice","pdRemark","pdTypeId","brandId")
                  VALUES ($1,$2,$3,$4,$5,$6)`,
            values: [
                req.body.pdId,
                req.body.pdName,
                req.body.pdPrice,
                req.body.pdRemark,
                req.body.pdTypeId,
                req.body.brandId,
            ],
        });

        const bodyData = req.body;
        const dateTime = new Date();
        bodyData.createDate = dateTime;
        res.status(201).json(bodyData);
    } catch (err) {
        return res.status(500).json({
            err: err.message,
        });
    }
}

export async function putAllProduct(req, res) {
    console.log(`PUT / products id : ${req.params.id} is Requested`);
    try {
        const result = await database.query({
            text: `UPDATE "products" 
              SET "pdName"=$1,
                  "pdPrice"=$2,
                  "pdRemark"=$3,
                  "pdTypeId"=$4,
                  "brandId"=$5
              WHERE "pdId"=$6 ;
              `,
            values: [
                req.body.pdName,
                req.body.pdPrice,
                req.body.pdRemark,
                req.body.pdTypeId,
                req.body.brandId,
                req.params.id
            ],
        });

        if (result.rowCount == 0) {
            return res.status(404).json({
                error: `id : ${req.params.id} is not found`
            })
        }

        const bodyData = req.body
        const dataTime = new Date()
        bodyData.updateDate = dataTime
        res.status(201).json(bodyData)

    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}

export async function deleteProduct(req, res) {
    console.log(`DELETE / products id : ${req.params.id} is Requested`);
    try {
        const result = await database.query({
            text: `DELETE FROM "products"
                 WHERE "pdId"=$1 ;
                `,
            values: [req.params.id],
        });

        if (result.rowCount == 0) {
            return res.status(404).json({
                error: `id : ${req.params.id} is not found`
            })
        }
        res.status(204).end()

    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}

export async function getProductById(req, res) {
    try {
        const result = await database.query({
            text: `
                                  SELECT p.*,(
                                    SELECT row_to_json(brand_obj)
                                    FROM 
                                    (
                                      SELECT "brandId","brandName"
                                      FROM brands
                                      WHERE "brandId" = p."brandId"
                                    )brand_obj
                                  )AS brand,
  
                                  (
                                    SELECT row_to_json(pdt_obj)
                                    FROM 
                                    (
                                      SELECT "pdTypeId","pdTypeName"
                                      FROM "pdTypes"
                                      WHERE "pdTypeId" = p."pdTypeId"
                                    )pdt_obj
                                  )AS pdt
                                FROM products p 
                                WHERE p."pdId" = $1 
                                ORDER BY "pdId" ASC`
            ,
            values: [req.params.id]
        })

        if (result.rowCount == 0) {
            return res.status(404).json({
                error: `id : ${req.params.id} is not found`
            })
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}

export async function getProductByBrandId(req, res) {
    try {
        const result = await database.query({
            text: `SELECT p.*,(
                            SELECT row_to_json(brand_obj)
                            FROM 
                            (
                              SELECT "brandId","brandName"
                              FROM brands
                              WHERE "brandId" = p."brandId"
                            )brand_obj
                        )AS brand
              FROM products p 
              WHERE p."brandId" ILIKE $1`,
            values: [req.params.id]
        })
        if (result.rowCount == 0) {
            return res.status(404).json({
                error: `id : ${req.params.id} is not found`
            })
        }
        return res.status(200).json(result.rows);
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function getSearchProduct(req, res) {
    console.log(`GET / getSearchProduct id = ${req.params.id} is Requested`);
    try {
        const result = await database.query({
            text: `
                                  SELECT p.*,(
                                    SELECT row_to_json(brand_obj)
                                    FROM 
                                    (
                                      SELECT "brandId","brandName"
                                      FROM brands
                                      WHERE "brandId" = p."brandId"
                                    )brand_obj
                                  )AS brand,
  
                                  (
                                    SELECT row_to_json(pdt_obj)
                                    FROM 
                                    (
                                      SELECT "pdTypeId","pdTypeName"
                                      FROM "pdTypes"
                                      WHERE "pdTypeId" = p."pdTypeId"
                                    )pdt_obj
                                  )AS pdt
                                  
                                FROM products p 
                                WHERE (
                                p."pdName" ILIKE $1)          
                                          ORDER BY "pdId" ASC`,
            values: [`%${req.params.id}%`],
        });

        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}

