 function mask(id, fn) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function() {
      this.value = fn(this.value.replace(/\D/g, ''));
    });
  }

  mask('cnpj', v => {
    v = v.slice(0,14);
    if (v.length > 12) return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
    if (v.length > 8)  return v.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
    if (v.length > 5)  return v.replace(/(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
    return v;
  });

  mask('cep', v => {
    v = v.slice(0,8);
    return v.length > 5 ? v.replace(/(\d{5})(\d{0,3})/, '$1-$2') : v;
  });

  mask('cpf', v => {
    v = v.slice(0,11);
    if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    if (v.length > 3) return v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    return v;
  });

  ['tel','tel2'].forEach(id => mask(id, v => {
    v = v.slice(0,11);
    if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    if (v.length > 6)  return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    if (v.length > 2)  return v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    return v;
  }));

  document.getElementById('cep').addEventListener('blur', async function() {
    const v = this.value.replace(/\D/g, '');
    if (v.length !== 8) return;
    try {
      const d = await (await fetch(`https://viacep.com.br/ws/${v}/json/`)).json();
      if (!d.erro) {
        document.getElementById('rua').value    = d.logradouro || '';
        document.getElementById('bairro').value = d.bairro     || '';
        document.getElementById('cidade').value = d.localidade || '';
        const s = document.getElementById('estado');
        for (let o of s.options) if (o.value === d.uf) { s.value = d.uf; break; }
      }
    } catch(e) {}
  });