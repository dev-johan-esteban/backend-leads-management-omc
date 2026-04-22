import request from 'supertest';
import app from './index.js';

describe('Pruebas de la API de Leads', () => {
  
  

  // Test 1: Verificar que obtiene los leads
  test('GET /leads debería retornar una lista de leads', async () => {
    const res = await request(app).get('/leads');
    expect(res.statusCode).toEqual(200);
    // verificamos que la propiedad 'leads' sea un arreglo
    expect(Array.isArray(res.body.leads)).toBe(true);
    // verificar que al menos traiga un lead
    expect(res.body.leads.length).toBeGreaterThan(0);
  });

  // Test 2: Verificar creación de un lead (simulado)
  test('POST /leads debería fallar si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/leads')
      .send({
        nombre: "" // Enviamos datos incompletos
      });
    // Verificamos que el código sea 400 (Petición incorrecta)
    expect(res.statusCode).toEqual(400);
    // Verificamos que el cuerpo de la respuesta tenga un mensaje de error
    expect(res.body).toHaveProperty('errors');
    console.log('Mensaje de error recibido:', res.body.message);
  });
});