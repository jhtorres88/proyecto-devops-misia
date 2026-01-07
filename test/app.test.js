const request = require('supertest');
const app = require('../app');

describe('Pruebas de la API', () => {
    it('debería responder con un mensaje de éxito en la raíz', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });
});