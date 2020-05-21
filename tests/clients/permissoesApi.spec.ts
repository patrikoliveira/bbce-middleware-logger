import axios from "axios";
import PermissoesApi from "../../src/clients/permissoesApi";
import FuncionamentoBBCEApi from "../../src/clients/funcionamentoBBCEApi";
import ControleAcessoService from "../../src/services/controleAcessoService";
// import ControleAcesso from "../../src/middlewares/controleAcesso";

describe("should be conect in Permissoes API", () => {
  const apiPermissaoAxios = axios.create({
    baseURL: "http://dev.bbce.rarolabs.com:8003/usuarios/v1",
  });

  const apiFuncionamentoBBCEAxio = axios.create({
    baseURL: "http://dev.bbce.rarolabs.com:8005/parametros/v1",
  });

  it("should be connect in apis", async () => {
    const permissoesApi = new PermissoesApi(apiPermissaoAxios);
    const funcionamentoBBCEApi = new FuncionamentoBBCEApi(apiFuncionamentoBBCEAxio);
    const controleAcessoService = new ControleAcessoService(permissoesApi, funcionamentoBBCEApi);
    const userId = 38;

    const escopoValidacao = [1, 7, 9, 43];

    const validatedServices = await controleAcessoService.validaAcessoServico(userId, escopoValidacao);

    expect(validatedServices).toStrictEqual(escopoValidacao);
  });
});
