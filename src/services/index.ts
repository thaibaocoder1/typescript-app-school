export class DataResource<T> {
  constructor(private endpoint: string) {}
  async loadAll(): Promise<T[]> {
    const res = await fetch(this.endpoint);
    const result = await res.json();
    return result.data;
  }
  async loadWithSlug(slug: string): Promise<T[]> {
    const res = await fetch(`${this.endpoint}/list?slug=${slug}`);
    const result = await res.json();
    if (result.success) {
      return result.data;
    }
    return result;
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
  async update(
    id: number | string,
    fieldsToUpdate: Partial<T>
  ): Promise<Response> {
    const res = await fetch(`${this.endpoint}/${id}?_method=PATCH`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fieldsToUpdate),
    });
    return res;
  }
  async save(data: Partial<T>): Promise<Response> {
    const res = await fetch(`${this.endpoint}/save?_method=POST`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  }
  async saveFormData(data: FormData): Promise<Response> {
    const res = await fetch(`${this.endpoint}/save?_method=POST`, {
      method: "POST",
      body: data,
    });
    return res;
  }
}
