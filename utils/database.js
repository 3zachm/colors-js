const { createConnection } = require('mysql');
const { dbInfo } = require('../config.json');

const conn = createConnection(dbInfo);

conn.connect(err => {
    if (err) return console.log(err);
    console.log('Database connected\n');
});

module.exports = {
    guildGetRole: function(guildId, callback) {
        conn.query('SELECT role FROM guilds WHERE id = ?', [guildId], (err, result) => {
            if (err) return console.log(err);
            return callback(result[0].role);
        });
    },
    guildCreate: function(guildId) {
        conn.query('INSERT INTO guilds (id, role) VALUES (?, ?)', [guildId, ''], (err, result) => {
            if (err) return console.log(err);
            return result;
        });
    },
    guildSetRole: function(guildId, roleId) {
        conn.query('UPDATE guilds SET role = ? WHERE id = ?', [roleId, guildId], (err, result) => {
            if (err) return console.log(err);
            return result;
        });
    },
    killConnection: function() {
        conn.end(err => {
            if (err) return console.log(err);
            console.log('Database disconnected\n');
        });
    },
};