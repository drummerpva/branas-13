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


# Arquitetura Exagonal, Ports and Adapters
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