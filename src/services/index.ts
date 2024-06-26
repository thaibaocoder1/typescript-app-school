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

  async loadRemove(): Promise<T[]> {
    const res = await fetch(`${this.endpoint}/trash-users`, {
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

  async loadWithParams(params: URLSearchParams): Promise<T> {
    const res = await fetch(`${this.endpoint}/params?${params}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result;
  }

  async loadOne(id: string): Promise<T> {
    const res = await fetch(`${this.endpoint}/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result.data;
  }

  async loadWithStatus(): Promise<T> {
    const res = await fetch(`${this.endpoint}/statistical`, {
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

  async refresh(): Promise<Response> {
    const res = await fetch(`${this.endpoint}/refresh`, {
      credentials: "include",
    });
    return res;
  }

  async verify(id: string): Promise<T> {
    const res = await fetch(`${this.endpoint}/verify/${id}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result.data;
  }

  async active(id: string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      credentials: "include",
    });
    return res;
  }

  async forgot(value: Partial<T>): Promise<Response> {
    const res = await fetch(`${this.endpoint}/forgot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
      credentials: "include",
    });
    return res;
  }

  async change(value: Partial<T>): Promise<Response> {
    const res = await fetch(`${this.endpoint}/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
      credentials: "include",
    });
    return res;
  }

  async recover(value: Partial<T>): Promise<Response> {
    const res = await fetch(`${this.endpoint}/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
      credentials: "include",
    });
    return res;
  }

  async confirmRecovey(params: URLSearchParams): Promise<T> {
    const res = await fetch(`${this.endpoint}/confirm-recover?${params}`, {
      credentials: "include",
    });
    const result = await res.json();
    return result;
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

  async validate(value: string[]): Promise<Response> {
    const res = await fetch(`${this.endpoint}/validate?_method=POST`, {
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

  async softDelete(id: string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/soft/${id}?_method=DELETE`, {
      method: "DELETE",
      credentials: "include",
    });
    return res;
  }

  async restore(id: string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/restore/${id}?_method=PATCH`, {
      method: "PATCH",
      credentials: "include",
    });
    return res;
  }

  // [UPDATE]
  async update(id: string, fieldsToUpdate: Partial<T>): Promise<Response> {
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

  // Email: Invoice
  async invoice(id: string): Promise<Response> {
    const res = await fetch(`${this.endpoint}/invoice/${id}`, {
      credentials: "include",
    });
    return res;
  }
}
