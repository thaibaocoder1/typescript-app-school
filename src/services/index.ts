export class DataResource<T> {
  constructor(private endpoint: string) {}
  async loadAll(): Promise<T[]> {
    const res = await fetch(this.endpoint);
    const result = await res.json();
    return result.data;
  }
  async loadOne(id: number | string): Promise<T> {
    const res = await fetch(`${this.endpoint}/${id}`);
    const result = await res.json();
    return result.data;
  }
  async delete(id: number | string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
    return res;
  }
  async save(data: T): Promise<Response> {
    const res = await fetch(`${this.endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  }
}
