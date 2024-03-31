export class DataResource<T> {
  constructor(private endpoint: string) {}

  // [GET]
  async loadAll(): Promise<T[]> {
    const res = await fetch(this.endpoint, {
      credentials: "include",
    });
    const result = await res.json();
    return result.data;
  }

  async loadWithSlug(slug: string): Promise<T[]> {
    const res = await fetch(`${this.endpoint}/list?slug=${slug}`, {
      credentials: "include",
    });
    const result = await res.json();
    if (result.success) {
      return result.data;
    }
    return result;
  }

  async loadOne(id: number | string): Promise<T> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result.data;
  }

  // [AUTH]
  async check(data: Partial<T>): Promise<Response> {
    const res = await fetch(`${this.endpoint}/login?_method=POST`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return res;
  }

  async refresh(token: string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/refresh/${token}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result.data;
  }

  async verify(id: string): Promise<T> {
    const res = await fetch(`${this.endpoint}/verify/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result.data;
  }

  async logout(id: string): Promise<T> {
    const res = await fetch(`${this.endpoint}/logout/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result.data;
  }

  async checkCoupon(value: Partial<T>): Promise<Response> {
    const res = await fetch(`${this.endpoint}/check?_method=POST`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
      credentials: "include",
    });
    return res;
  }

  // [DELETE]
  async delete(id: number | string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res;
  }

  // [UPDATE]
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
      credentials: "include",
    });
    return res;
  }

  async updateField(id: string, fieldsToUpdate: Partial<T>): Promise<Response> {
    const res = await fetch(
      `${this.endpoint}/update-fields/${id}?_method=PATCH`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldsToUpdate),
        credentials: "include",
      }
    );
    return res;
  }

  // [ADD]
  async save(data: Partial<T>): Promise<Response> {
    const res = await fetch(`${this.endpoint}/save?_method=POST`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return res;
  }

  // [ADD - FormData]
  async saveFormData(data: FormData): Promise<Response> {
    const res = await fetch(`${this.endpoint}/save?_method=POST`, {
      method: "POST",
      body: data,
      credentials: "include",
    });
    return res;
  }

  // [Update - FormData]
  async updateFormData(data: FormData): Promise<Response> {
    const res = await fetch(
      `${this.endpoint}/update/${data.get("id")}?_method=PATCH`,
      {
        method: "PATCH",
        body: data,
        credentials: "include",
      }
    );
    return res;
  }
}
