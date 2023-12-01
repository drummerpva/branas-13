# Code Smells 
## Nomes Ruins (Variável, método, classe)
### Renomeá-los

## Código comentado
### Talvez o código pudesse ser maisc laro para não precisar do comentário

## Código morto (código "desligado")
## Distância da margem (aumento da complexidade)
## Comandos condicionais complexos (acúmulo de ifs e elses)
## Linha em branco (sem padrão)
## Números mágicos (que poderiam ser constantes)
## Responsabilidades Diferentes (quebra do SRP)
## Métodos grandes
## Classe grande
## Tratamento de exceções inadequado (return -1, try/catch desnecessário)
## Variáveis decalradas muito antes da sua utilização (eventualmente grupos de variáveis)
## Variáveis decalras juntas
## Variável não tipada(em linguagens onde  a tipagem é obrigatória)
## Else desnecessário (inverter o if)

# TDD
## É impossível ser mais rápido que o computador
## Vou testar o que eu quero que funcione
## Teste manuais são importantes, para verificar a semântica e validação, mas para verificar o código e regreção é necessário testes automatizados
## Escrever teste requer DISCIPLINA
## Fica difícil ao estar acostumado a começar pela tela ou banco de dados, não pelo domínio
## O que é teste automatizado?
### Dado um conjunto de entradas, quando algo acontecer a saída deve suprir as expectativas
### Given/Arrange: Definição de todas as informações necessárias para executar o comportamento que será testado
### When/Act: Executar o comportamento
### Then/Assert: Verificar o que aconteceu após a execução, comparando as informações retornadas com a expectativa que foi criada(O mais importante)

## Fazer testes depois da solução pronta é mais complexo

## Tipos de testes automatizados
### Teste de unidade
#### As vezes você não tem uma unidade para testar
#### Componentes que pertencen à mesma camada
#### Os mais rápidos
### Teste de integração
#### Mais efetivo que de unidade
#### Mais fácil de implementar em sistemas legados
#### Componentes de multiplas camadas
#### Pode ser mais lento caso haja I/O externo
#### Narrow
##### Testa apenas uma porção do código
##### Usa dublês de teste
#### Broad
##### Testa com todas as funcionalidades ativas(I/O externo, network...)
### Teste E2E(Ponta à ponta)
#### Replica o ambiente do usuário final
#### Mais lentos
#### Frágeis, pois são quebrados facilmente, caso a interface com o usuário final seja modificada

## Test Double
### É um padrão que tem o objetivo de susbstituir um DOC(depended-on component) em um determinado tipo de teste por motivos de performance ou segurança
### Livro xUnit Test Patterns
### [Mocks are note Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
### [The Little Mocker](https://blog.cleancoder.com/uncle-bob/2014/05/14/TheLittleMocker.html)
### Fake
#### Uma implementação mais completa que substituirá a real

### Mock
#### Similar ao stubs e spies, permitem que você diga exatamente o que quer que ele faça e o teste vai quebrar se isso não acontecer
#### Ex: mocked.once().calledWith(); mocked.verify();

### Spy
#### Objetos que "espionam" a execução do método e armazenam os resultados para verificação posterior
#### Ex: Quando eu executar o método fazer pedido preciso saber se o método enviar email foi invocado internamente e com quais parâmetros

### Stub
#### Objetos que retornam respostas prontas, defnidas para um deterimnado teste, por questão de performance ou segurança
#### Ex: Quando eu executar o método fazer pedido, preciso que o método pegar cotação do dólar retorne R$3,00

### Dummy
#### Objetos para completar lista de parâmetros

## F.I.R.S.T.
### F -> Fast: Os testes devem rodar rápido
### I -> Independent: Não deve existir dependência entre os testes, eles devem poder ser executados de forma isolada
### R -> Repeatable: O resultado deve ser o mesmo independente da quantidade de vezes que seja exeutado
### S -> Self-validating: O próprio teste deve ter uma saída bem definida que é válida ou não fazendo com que ele passe ou falhe
### T -> Timely: Os testes devem ser escritos antes(ou durante) a escrita do código fonte

## Three Laws of TDD(Três regras do TDD) Robert C. Martin
### Você não pode escrever nenhum código até ter escrito um teste que detecte uma possível falha
### Você não pode escrever mais testes de unidadedo que o suficiente para detectar a falha
### Você não pode escrever mais códiugo do que o suficiente para passar nos testes


# Arquitetura Hexagonal, Ports and Adapters
## Estamos fazendo decisões de Design, que são restringidas pela decisão de arquitetura
## Fazer uma separação de responsabilidades
### Driver Side/Driver Actor
#### Que conduz a aplicação
#### API, Fila, CLI, Test case

### Resources Side/Driven 
#### O que a aplicação consome
#### DB, Email, Fila, Impressora

## Permite poder isolar/testar a aplicação de recursos externos
## O Exagono é apenas por uma questão visual

# REST
## Os verbos não casam com use cases, tendem a se encaixar com CRUDs

# Table Module Pattern
## Uma unica instância que trata regras de negócio juntamente com os registros de uma tabela de banco de dados
## Junta regras de negócio e acesso à dados(separando os componentes por tabela)

# Table Data Gateway Pattern(sinônimo de DAO(Data Access Object))
## Um objeto que atua como um gateway para uma tabela do banco de dados
## Trate todo o acesso à tabela em um mesmo lugar

# Ports and Adapters(Arquitetura Hexagonal)
## Ports = Interfaces que a aplicação irá depender e adaptadores implementaram(Driven Side [AccountDAO, AccountRepository], Driver Side[signup, getAccount])
## Adapters = Implementação de interfaces criadas para abstrair um recurso ou uso por ator externo
## Toda Clean Architecture é uma Hexagonal

# Clean Architecture
## Objetivo
### Desacoplar regras de negócio, dos recursos/tecnologias que a aplicação consome
### O centro da aplicação não é o banco de dados,nem qualque framework
### O centro da aplicação são os use cases(casos de uso) e o domínio(regras de negócio)
## Camadas
### Entities(entidade) são responsáveis por abstrair as !regras de negócios independentes!, que podem ser desde um objeto com métodos até mesmo um conjunto de funções
#### Não são as mesma que utilizamos em um Data Mapper(ORM)
#### O problema do domínio anêmico
##### Quando você separa os dados do comportamento, a classe fica apenas com os dados, se tornando anêmica
##### Transaction Script trabalha com domínio anêmico
#### O Domain Model liga com objetos que comtém dados e comportamentos

### Application Bussines Rules (Use Cases)
#### É uma intenção dentro do sistema, todo comportamento que é executado é um use case
#### Realizam a orquestração das entidades e dos recursos externos
#### Usar Screaming Architecture(Arquitetura gritante, explicita) para criar os use cases
#### Não usar para CRUDs
#### Fornece portas para que camdas superiores o supra de recursos que ele precisa conhecer
##### Ex: Use case RequestRide, interface RequestRideDAO, irá conter a assinatura das chamadas que o use case fará uso, é o ISP do SOLID

### Interface Adapters
#### Fazem a ponte entre s casos de uso e os recursos externos
#### Requisição HTTTP chegando
#### Acesso ao banco de dados
#### Integração com uma API externa(chamada)
#### Escrita e leitura no sistema de arquivos(disco)
#### Conversão de dados específicos como CSV e PDF
#### Use Case não conhece Interface Adapters

### Frameworks and Drivers
#### Nível mais baixo de abstração
#### É a interação com a tecnologia, componentes que realizam a conexão com DB, requisições HTTP, interação com o sistema de arquivo ou recursos do SO

## 4 camadas? 
### Nem sempre, normalmente 3, mas se quiser separar de frameworks and drivers dos interface adapters terá 4

## Composition Root
### Main, onde será composto o grafo de dependências

# Static Factory Method do Livro Effective Java
## Você foge do teu construtor e cria instancias através de funções fábricas estáticas
## Permite separar instanciação da re-hidratação
## Muito útil para traser semântica a criação e ter opção caso a linguagem não tenha sobrecarga de construtor

# DDD(Domain Driven Design)
## O que é um domínio?
### O domínio é o problema, em termos de negócio, que precisa ser resolvido independente da tecnologia que será utilizada
## Nem sempre é fácil extrair o conhecimento relacionado ao domínio
## Linguagem Ubíqua(Onipresente)
### Ideal é usar essa mesma linguagem dentro do código
## Se divide em duas partes
### Modelagem Estratégica
#### Context Map
#### Como subdivido meu domínio
### Modelagem Tática
#### Modelo de domínio dentro de um contexto delimitado
#### Utilizada para construir a camada de domínio

## DDD complementa a camada de Entities do Clean Architecture
## DDD é considerado um design aplicado a camada de domínio
## Objetos de domínio
### Entities
#### Abstraem regras de negócio independentes
#### Tem identidade e estado
#### Pode sofrer mutação ao longo do tempo
#### Como gerar a identidade?
##### Manualmente: O próprio usuário pode gerar a identidade da entidade, por exemplo, utilizando o email ou um documento de identificação
##### Aplicação: A aplicação pode utilizar um algoritmo para gerar a identidade como um gerador de UUID
##### Banco de dados: O bando de dados por meio de uma sequência ou outro de tipo de registro, centralizando a geração de identidade
#### Como comparar?
##### A comaparação entre entities se dá pela identidade(id), sem levar em consideração suas características

### Value Objects
#### Também contém regras de negócio independentes, no entando são identificados pelo seu valor, sendo imutáveis, ou seja, a mudança implica na sua substituição
#### Mede, quantifica ou descreve alguma coisa
#### Se valor é imutável
#### É substituido quando seu valor mudar
#### Pode ser comparado pelo valor que representa
#### Não precisa ter um valor apenas, pode conter um conjunto de valores
#### Ex:
##### Code: Representa uma determinada regra de formação de um número
##### Cpf: Garante qu eo número do documento é válido
##### Dimension: Abstrai a largura, altura, profundidade e peso de um item
##### Password: Representa uma senha
##### Color: Uma cor no formato RGB
##### Coord: A latitude e longitude
##### Email: Representa um email
##### Position: Representa uma posição geográfica no tempo
##### Segment: Representa duas posiçÕes geográficas no tempo
#### Substituir por um ou mais primitivos
##### Uma técnica para identificar um value object é tentar substituí-lo por um tipo primitivo como uma string ou um número

### Domain Services
#### Realiza tarefas específicas do domínio, não tendo estado
#### É indicado quando a operação que você quer executar não pertence a uma entity ou a um value object
#### Utilize em operações que envolvem múltiplos objetos de domínio
#### Normalmente quando uma operação afeta múltiplos objetos de domínio, não pertencendop a nenhum deles, ela deve ser descrita em um domain service
#### Não crie serviços no lugar de entities e value objects, favorecendo um modelo anêmico
#### Exemplos
##### DistanceCalculator: pegando daus coordenadas retorna a distância
##### FareCalculator: Calcula o valor de um segmento da corrida
##### TokenGenerator: Gera um token de acordo com um email
##### AccountTransfer: Pega duas Accounts e faz transferência entre elas

### Aggregates
#### A relação entre os objetos de domínio não é a mesma utilizada no banco de dados
#### Grandes aggregates poodem trazer desperdício de memóri, além de sobrecarregar o banco de dados sem necessidades, já que nem sempre a camada de aplicação estará interessada em utiliza-lo na íntegra
#### O desafio é balancear a preservação da invariância com o consumo de recursos
##### Não ter uma entidade por aggregate, nem 100 entidade por aggregate
#### Um aggregate é um agrupamento, ou clustes, de objetos de domínio como entities e value objects, estabelecendo os relacionamentos entre eles
#### Todas as operaçõs são realizadas por meio da ráiz, que é uma entity ou aggregate root <AR>
#### Boas práticas na criação
##### Crie aggregates pequenos: Comece sempre com apenas uma entidade e cresça de acordo com as necessidades
##### Referencie outros aggregates por identidade: Mantenha apenas referência para outros aggregates, isso reduz a quantidade de memória e o esforço que o repositório faz para recuperá-los
#### Se estiver difícil de implementar o repostório, talvez o aggregate seja muito grande e possa ser separado
#### Um aggregate por referenciar outro por Identidade(ID)
#### Um aggregate pode ter apenas uma entidade
#### Uma entidade não faz sentido participar de mais de um aggregate

### Repositories
#### É uma extensão do domínio, reponsável por realizar a persitência dos aggregates, separando o domínio da infraestrutura
#### Repository vs DAO(Table Data Gateway)
##### DAO vai lidar com tabelas(CRUD)
##### Repository vai peristir/recuperar o Aggregate inteiro, para manter o estado interno válido
#### Somente parte do aggregate mudou, posso persistir apenas essa parte? NÃO
##### A persistência é sempre realizada sobre o aggregate inteiro, no entando a implementação do repository pode decdir quais registros do banco de dados devem ser atualizados
#### Posso obter apenas parte do aggregate? NÃO
##### Ter um Query Model do CQRS pode resolver, deixando de lado DDD para obtenção
#### Posso utilizar lazy loading dentro do aggregate? NÃO
##### Talvez a solução é diminuir o aggregate, pos a preservação da invariância depende da integridade do aggregate, se parte dele não estiver populado pode perder o sentido
#### É possivel utilizar diferentes filtros para obter um aggregate? Sim porem...
##### Pode deixar muito complexa obtenção de dados, novamente o Query Model do CQRS seria uma melor escolha para isso
#### Posso gerar dados para emissão de um relatório a partir de um repository? Não faz sentido
##### Geralmente irá precisar de muitos dados, de muitos aggregates, mais uma vez um Query Model seria melhor
##### A granularidade de um relatório é diferente da utilizada pelo aggregate e renderizar relatórios a partir de repositories pode ser excessivamente complexo, prefira a utilização de CQRS com ac riação de consultas separadas

## Modelagem estratégica
### Usar uma base de código só, ela vai acabar crescendo demais
#### Com o tempo, principalemnte em um domínio complexo, existe o risco de isso acontecer...
#### São muitas pessoas envolvidas, existe a integração de diversas áreas de negócio
#### Normalmente acontece um fenômeno conhecido como Big Ball of Mud
### Modelagem estratégica identifica e define fronteiras entre os bounded contexts
#### Todo domínio pode e deve ser dividido em subdomínios
#### Tipos de subdomínio
##### Core ou Basic: É o mais importante e que traz mais valor para a empresa, é onde você coloca seus maiores e melhores esforços
##### Support ou Auxiliary: Complementa o core domain, sem ele não é possíevl ter sucesso no negócio
##### Generic: É um subdomínio que pode ser delegado para outra empresa ou mesmo ser um produto de mercado

#### Bounded Context
##### É onde eu vou ter minha modelagem tática
##### Vai ajudar a não cair no Big Ball of Mud
##### É um bom ponto de divisão de micro-serviços
##### Qual a relação entre um subdomínio e um bounded context?
###### Um único Bounded Context atendendo vários subdomínios seria um Monolito
###### Um subdomínio pode ter 1 ou mais bounded context
###### Na dúvida adote a relação de 1:1, ou seja, cada sudomínio sendo implementado em um único bounded context
##### Imagine um bounded context como uma forma de modularização de negócio que tem como objetivo reduzir o acoplamento interno do código-fonte
##### Nem todo bounded context precisa ser desenvolvido da mesma forma
###### Um pode ser desenvolvido com DDD no nível tático e outro com transaction script
##### A fronteira do bounded context é EXCELENTE para definir um micro serviço

#### DDD é algo que você aplica na organização como um todo
#### A forma de interação entre cada bounded context dá origem ao Context Map

#### Os padrões de integração definem naturamente o tipo de relacionamento entre cada bounded context
##### Partnership(Parceria)
###### Subdomínios diferentes tem um grau de parceria
###### Duas ou mais equipes podem trabalhar de forma sincronizada numa entrega que envolve dois ou mais bounded context

##### Shared Kernel
###### Uma espécie de biblioteca compartilhada entre equipes
###### É relativamente normal compartilhar parte do código comum entre vários bounded contexts, principalmente por propósitos não relacionados diretamento ao negócio mas por infraestrutura
###### Em termos mais técnicos, o código pode ser compartilhado por meio de relacionamento direto em um monorepo ou algum tipo de biblioteca que deve ser versionada e publicada internamente para que possa ser importada pelos outros bounded contexts
###### Importante evitar, se precisar faz por meio de biblioteca/pacote

##### Customer/Supplier
###### Upstream quem fornece / Downstream quem consome
###### Existe uma relação de fornecimento onde tanto o consumidor quanto o fornecedor podem determinar como deve ser o contrato entre eles
###### Conformista: Quem fornece não está preocupado com quem consome = Uma integração com uma API externa, contratada no modelo SaaS, acaba quase sempre sendo do tipo conformista já que temo que nos adequar a sua interface, nesses casos é normal oferecer um Open Host Service com uma Published Language
###### Open Host Service e Published Language: Criar uma representação externa do seu domínio(inverso do ACL) para ficar mais claro para quem vai consumir, um exemplo seria um BFF e uma Facade(Fachada)
###### Anti-corruption Layer(ACL): Uma camada para traduzir os dados de um fornecedor para a linguagem interna do consumidor, protegendo o domain da linguagem dos seu fornecedor
###### As relações conformistas geralmente exigem uma tradução para o domínio e isso pode ser feito por meio de adaptadores importantes para inclusive permitir a utilização de diferentes fornecedores

##### Eventualmente vale mais a pena ir por caminhos diferentes e não ter qualquer tipo de relação

#### Microservices
##### A fronteira do bounded context é EXCELENTE para definir um microserviço

##### Vantagens
###### Diversidade tecnológica
###### Melhor controle sobre o débito técnico
###### Facilidade em acompanhar a evolução tecnolófica(por conta de uma base de código menor)

##### Desafios
###### Transações distribuidas
###### Dificuldade em tratar e diagnosticar erros
###### Complexidade técnica mais alta

##### Fazendo uma boa modelagem estratégica
###### Divisão de complexidade
###### Equipes menores
###### Reuso

##### Comunicação assíncrona, Event-Driven Architecture, CQRS
###### Escalabilidade
###### Independência entre os serviços
###### Tolerância à falhas
###### Resiliência

##### Uma arquitetura monolítica nem sempre é ruim
###### Para projetos menores com equipes pequenas, pricipalmente no início da construção de um produto, é a arquitetura que dá mais resultado com o menor esforço e custo de infraestrutura
###### No início o monolito deixa tudo mais produtivo, ao ficar muito grande perde-se essa produditividade e então possível separação de serviços

# Event-Driven Architecture
## O que é uma transação?
### Transação é a abstração de um conjunto de operações que devem ser tratada como uma única unidade lógica
### Para ter sucesso, todas as suas operações devem ser bem sucedidas ou serem desfeitas
### Uma forma comum de pensar em uma transação é pelo conceito de ACID(Atomicity, Consistency, Isolation e Durability), relacionado a comandos executados em banco de dados relacional
### Padrão Unit of Work vai orquestrar todos os comandos de diferentes repositorios fazendo um commit ao final
### Nem todas as operaçÕes de uma transação são realizadas dentro do banco de dados
## Teorema CAP(Consitency, Availability e Partition Tolerance)
### AC: Sem particionamento, os dados estão consistentes e disponíveis
### AP: Com particionamento, ao optar pela disponibilidades, se a conexão entre os nodos cair, perdemos consitência
### CP: Com particionamento, ao optar pela consitência, se a conexão entre os nodos cair, perdemos disponibilidade
## Existem muitas operações independentes, que podem ou não ser distribuídas em serviços diferentes
### Upload de um vídeo em um canal do youtube
#### Verificação de direitos autorais
#### Conversão para diferentes formatos
#### Transcrição das legendas
#### Notificação dos inscritos
#### Atualização do algoritmo de busca
#### Atualização dos algoritmos de recomendação
### O que acontece se faltar memoria na hora de converter o vídeo?
### Compra de um produto em uma e-commerce
#### Processamento do pagamento
#### Emissão da NF
#### Expedição do estoque
#### Solicitação de coleta
#### Crédito de pontos de fidelização
#### Geração de cupom de desconto para a próxima compra
### O que acontece se a nota fiscal não puder ser emitida porque o certificado digital expirou?
### Finalização de uma corrida
#### Cálculo da distância
#### Cálculo da tarifa
#### Processamento do pagamento
#### Envio do comprovante da corrida
#### Emissão da NF
### O que acontece se o gateway de pagamento estiver fora do ar?
## A maior parte dos sistemas tem transações independentes e com muitos pontos de falha
## Quanto mais complexa e distribuída for a arquitetura, maiores são as chances de alguma coisa dar errado e a resiliência é a capacidade de manter o funcionamentos e serecuperar de falhas
## Como lidar com transaçÕesde forma resiliente?
### É possível adotar padrões como Retry, Fallback ou até mesmo SAGA
#### O padrão Retry simplesmente realiza uma ou mais retentativas em um pequeno intervalo de tempo, elas podem resolver problemas simples como perda de pacotes, oscilações na rede e até mesmo um deploy fora de hora
#### O padrão Fallback ao se deparar com uma indisponibilidade faz a tentativa em outro serviço, por exemplo, um grande e-commerce deve trabalhar com diversos adquirentes de cartão de crédito para evitar indisponiblidades e até mesmo bloqueios
#### O padrão SAGA é responsável pelo gerenciamento de uma transação de logna duração por meio de uma sequência de transações locais
#### 3 Tipos de transação no SAGA
##### Pivot Transaction: São transações go/no go, ou seja, a partir delas é decidido se o fluxo de execução segue em frente ou é abortado
##### Compensable Transaction: São desfeitas caso a transação toda seja abortada
##### Retriable Transaction: Tem uma garantia de execução e podem se recuperar de uma possível falha ou indisponibilidade
#### Dois tipos de SAGA
##### Orquestrado: Algoritmo único(oquestrador centralizado) que vai chamando os serviços e analizando seus resultados e tomando decisões com base nisso | Existe uma lógica centralizada que faz a coordenação de cada um dos passos
##### Coreografada: cada participante publica e trata eventos de forma independente, decidindo como realizar a sua parte | Não terá nenhum agente no meio que saiba como o fluxo funciona

## Uma arquiterura orientada a eventos, ou Event-Driven Architecture, é uma solução para transações distribuídas em um ambiente de microservices tendo baixo acoplamento, de forma assíncrona e sem a ncessidade de um orquestrador(Basicamente é uma SAGA coreografada)
## O que é um evento?
### Os eventos são fatos que aconteceram no domínio e que podem ser um gatilho para a execução de regras de negócio
#### Ex:
##### OrderPlaced
##### PaymentApproved
##### Invoice Generated
##### RideRequested
##### RideEnded
##### PositionUpdated
### Não são necessariamente relacionadas a microservices,foram criadas em 1987 e podem ser aplicadas em qualquer tipo de transação distribuída de longa duração

## Em Geral sempre terão
### Producer
### EventBroker que encapsula as Queues(filas)
### Consumer
## O porquê de filas
### Não existem recursos suficientes disponíveis
### Se você enfilera você pode ter máquinas menores
### Seria muito caro ter recursos para atender a todo de forma imediata
#### Garçon, caixa de supermercado etc...
### Em diversos momentos, por conta da ociosidade, eles seriam desperdiçados
## Como fazer a implementação das filas?
### Localmente por meio de um intermediário que implementa um mecanismo de notificação
### Os algoritmos geralmente são baseados nos padrões Observer e Mediator
### Pela rede por meio uma plataforma de mensageria
### Alguns tipos de plataforma de mensageria
#### RabbitMQ
#### Kafka
#### AWS SQS
#### ActiveMQ
#### Google Pub/Sub
#### ZeroMQ
#### Pulsar

## Adotar uma arquitetura orientada a eventos tem os seguintes benefícios:
### Baixo acoplamentos entre os use cases dentro e fora de um serviço
### Tolerância a falha com capacidade para retomar o processamento do ponto onde parou
### Melhor controle sobre o débito técnico
### Disponibilidade e escalabilidade mais alta
### Menos custos com infraestrutura*
### Melhor entendimento sobre o que aconteceu, inclusive com a possbilidade de PITR(Point in time recovery)

## Adotar um arquitetura orientada a eventos tem os seguintes desafios:
### Complexidade técnica mais alta
### Lidar com a duplicação de eventos
### Falta de clareza no workflow
### Dificuldade em trata e diagnosticar erros

## Qual é a diferença entre comando e evento?
### Enquanto o evento é um fato, que você precisa decidir como lidar, o comando é uma solicitação, eventualmente ela pode ser rejeitada
### Os nomes dos comantos são sempre no imperativo
#### PlaceOrder
#### PayInvoice
#### GenerateReport
#### EnrollStudent
#### UpdateCustomer
#### UploadFile
#### RequestRide
#### UpdatePosition
### O padrão command handler envolve justamente separar uma solicitação que antes era síncrona em duas etapas, uma que rece o comando e a outra que processa o comando(conectados por uma espécie de evento)


# Abstract Factory
## Provê uma interface para criação de famílias de objetos

# Singleton
## Ele só é considerado um anti pattern caso você guarde estado dentro dele