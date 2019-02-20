/**
 *  File contains all functions related to database. All CRUD operation queries 
 *  of all the tables are in this  file.
 */

const conn      = require('./database');
const Boom      = require('boom');

exports. adminSignup = (()=>{
    conn.query(`INSERT INTO admin(name,email,password,phone_no) VALUES ('sahil', 'sbhandari790@gmail.com', 'sahil','8437714375')ON DUPLICATE KEY UPDATE name = 'sahil',email='sbhandari790@gmail.com',password='sahil',phone_no='8437714375'`,function(err,rows){
        if(err) {
            return;
        }
    });
    conn.query(`INSERT INTO admin(name,email,password,phone_no) VALUES ('ravi', 'ravi@gmail.com', 'ravi','7837111541')ON DUPLICATE KEY UPDATE name = 'ravi',email='ravi@gmail.com',password='ravi',phone_no='7837111541'`,function(err,rows){
        if(err) {
            return;
        }
    });
})();

/**
 * Admin Login
 * @param {string} email 
 * @param {string} password 
 */
exports.adminLogin=(email,password)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT email,id from admin where email = '${email}' and password = '${password}' `, function(err, rows) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    reject(Boom.notFound("Invalid credentials").output.payload);
                }
                else{
                    resolve(rows[0]);
                }
            }
        });
    })
}

/**
 * Add Customer
 * @param {string} CustomerName 
 * @param {string} Email 
 * @param {string} password 
 * @param {number} PhoneNumber
 * @param {number} Latitude
 * @param {number} Longitude    
 */
exports.addCustomer = (customerName,email,password,phoneNo,lat,lon)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`INSERT INTO customer(name,email,password,phone_no,location) VALUES ('${customerName}', '${email}', '${password}', '${phoneNo}',GeomFromText('POINT(${lat} ${lon})'))`,function(err,rows,field){
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                resolve(rows);
            }
        });
    
    });
}

/**
 * To Get Customer Password.
 * @param {string} email 
 * @param {string} password 
 */
exports.getCustomerPassword=(email)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT password,id from customer where email = '${email}' `, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    reject(Boom.notFound("Invalid email").output.payload);
                }
                else{
                    resolve(rows[0]);
                }
            }
        });
    })
}

exports.getAllCustomers = (offset,limit)=>{
    return new Promise((resolve,reject) => {
        conn.query(`SELECT id,name,phone_no,email,location from customer LIMIT ${offset},${limit}`, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                resolve(rows);
            }
        });
    })
}

exports.deleteCustomer=(id)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`DELETE from customer where id='${id}'`,function(err,rows,fields){
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows.affectedRows==0){
                    reject(Boom.notFound('Invalid email').output.payload);
                }
                else{
                    resolve(id);
                }
            }
        });
    })
}

exports.updateCustomer=(customerName,email,phoneNo)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`UPDATE customer set name='${customerName}',phone_no='${phoneNo}' where email='${email}'`,function(err,rows,field){
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows.affectedRows==0){
                    reject(Boom.notFound('Invalid email').output.payload);
                }
                else{
                    resolve(rows);
                }
            }
        });
    })
}

exports.showCustomerBookings = (customerID,offset,limit,status)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT booking_id,pickup_location,destination_location,estimated_cost from booking where customer_id=${customerID} and status=${status} LIMIT ${offset},${limit}`, function(err, rows, fields) {
            if(err){
                console.log(err);
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                resolve(rows);
            }
        });
    })
}

exports.getID=(email,tableName)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT id from ${tableName} where email = '${email}' `, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    reject(Boom.notFound("Invalid email").output.payload);
                }
                else{
                    resolve(rows[0].id);
                }
            }
        });
    })
}

exports.getUniquePhoneNo = (phoneNo,tableName)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT phone_no from ${tableName} where phone_no = '${phoneNo}' `, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    resolve('unique phone no');
                }
                else{
                    reject(Boom.conflict('phone number already registered').output.payload);
                }
            }
        });
    })
}

exports.getUniqueEmail = (email,tableName)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT email from ${tableName} where email = '${email}' `, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    resolve('unique email no');
                }
                else{
                    reject(Boom.conflict('Email already registered').output.payload);
                }
            }
        });
    })
}

exports.getUniqueVehicleNo = (vehicleNo)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT vehicle_no from driver where vehicle_no = '${vehicleNo}' `, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    resolve('unique vehicle no');
                }
                else{
                    reject(Boom.conflict('vehicle no already registered').output.payload);
                }
            }
        });
    })
}

exports.getUniqueLicenseNo = (licenseNo)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT license_no from driver where license_no = '${licenseNo}' `, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    resolve('unique license no');
                }
                else{
                    reject(Boom.conflict('license no already registered').output.payload);
                }
            }
        });
    })
}

exports.addDriver = (driverName,email,password,phoneNo,vehicleNo,licenseNo,lat,lon)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`INSERT INTO driver(name,email,password,phone_no,vehicle_no,license_no,location,status) VALUES ('${driverName}', '${email}', '${password}', '${phoneNo}','${vehicleNo}','${licenseNo}',GeomFromText('POINT(${lat} ${lon})'),0)`,function(err,rows,field){
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                resolve(rows);
            }
        });
    
    });
}

exports.getDriverPassword=(email)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT password,id from driver where email = '${email}' `, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    reject(Boom.notFound("Invalid email").output.payload);
                }
                else{
                    resolve(rows[0]);
                }
            }
        });
    })
}

exports.deleteDriver=(email)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`DELETE from driver where email='${email}'`,function(err,rows,fields){
            if(err){
                console.log(err);
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows.affectedRows==0){
                    reject(Boom.notFound('Invalid email').output.payload);
                }
                else{
                    resolve(email);
                }
            }
        });
    })
}

exports.updateDriver=(driverName,id,phoneNo)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`UPDATE driver set name='${driverName}',phone_no='${phoneNo}' where id='${id}'`,function(err,rows,field){
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows.affectedRows==0){
                    reject(Boom.notFound('Invalid email').output.payload);
                }
                else{
                    resolve(rows);
                }
            }
        });
    })
}

exports.showDriverBookings = (driverID,offset,limit,status)=>{
    return new Promise((resolve,reject)=>{
        console.log('in show driver booking');
        conn.query(`SELECT booking_id,pickup_location,destination_location,estimated_cost from booking where driver_id=${driverID} and status=${status} LIMIT ${offset},${limit}`, function(err, rows, fields) {
            if(err){
                console.log(err);
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                resolve(rows);
            }
        });
    })
}

exports.createBooking = (customerID,fromLat,fromLon,toLat,toLon,cost)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`INSERT INTO booking (customer_id,pickup_location,destination_location,estimated_cost,date,time,status) VALUES ('${customerID}',GeomFromText('POINT(${fromLat} ${fromLon})'),GeomFromText('POINT(${toLat} ${toLon})'),${cost},CURRENT_DATE(),CURTIME(),0)`,function(err,rows,field){
            if(err){
                console.log(err);
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                resolve(rows);
            }
        });
    
    });
}

exports.showBookings = (offset,limit,status)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT booking_id,customer.email as customerEmail,customer.name as customerName,pickup_location,destination_location,estimated_cost from booking inner join customer on booking.customer_id=customer.id and booking.status = ${status} LIMIT ${offset},${limit}`, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                resolve(rows);
            }
        });
    })
}

exports.checkDriverAvailability = (driverID)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT status from driver where id=${driverID} and status=0`, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    reject(Boom.tooManyRequests('Driver not available').output.payload);
                }
                else{
                    resolve(rows[0]);
                }
            }
        });
    })
}

exports.assignDriver=(driverID,bookingID,adminID)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`UPDATE booking inner join driver on driver.id >= 1 set booking.status=1,booking.driver_id=${driverID},booking.admin_id=${adminID},driver.status=1 where driver.id='${driverID}' and booking_id=${bookingID}`,function(err,rows,field){
            if(err){
                console.log(err);
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows.affectedRows==0){
                    reject(Boom.notFound('Invalid Driver ID').output.payload);
                }
                else{
                    resolve(rows);
                }
            }
        });
    })
}

exports.setStatus=(driverID)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`UPDATE booking inner join driver on driver.id = booking.driver_id set booking.status=2,driver.status=0 where booking.driver_id='${driverID}'`,function(err,rows,field){
            if(err){
                console.log(err);
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows.affectedRows==0){
                    reject(Boom.notFound('Invalid Driver ID').output.payload);
                }
                else{
                    resolve(rows);
                }
            }
        });
    })
}

exports.checkAuthorization=(id,tableName)=>{
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT id from ${tableName} where id=${id}`, function(err, rows, fields) {
            if(err){
                reject(Boom.badImplementation('Implementation error').output.payload);
            }
            else{
                if(rows[0]==undefined){
                    reject(Boom.notFound(`${tableName} acess denied`).output.payload);
                }
                else{
                    resolve(rows[0]);
                }
            }
        });
    })
}