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

  // Test 3: Verificar paginación
  test('GET /leads con paginación debería limitar los resultados', async () => {
    const limit = 5;
    const res = await request(app).get(`/leads?page=1&limit=${limit}`);

    expect(res.statusCode).toEqual(200);
    
    // Verificamos que existan las propiedades de paginación
    expect(res.body).toHaveProperty('totalItems');
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('currentPage', 1);
    
    // Verificamos que el arreglo de leads no exceda el límite solicitado
    expect(res.body.leads.length).toBeLessThanOrEqual(limit);
  });

  // Test 4: Verificar filtrado por fuente
  test('GET /leads debería filtrar correctamente por fuente (facebook)', async () => {
    const fuente = 'facebook';
    const res = await request(app).get(`/leads?fuente=${fuente}`);

    expect(res.statusCode).toEqual(200);
    
    // Verificamos que, si hay resultados, todos sean de la fuente correcta
    if (res.body.leads.length > 0) {
      res.body.leads.forEach(lead => {
        expect(lead.fuente).toBe(fuente);
      });
    }
  });
});