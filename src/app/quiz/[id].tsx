import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, RADII } from '../../constants/theme';
import { byId } from '../../data/modules';
import {
  QUIZ_META,
  buildQuiz,
  shuffle,
  shuffleOptions,
  type MatchQuestion,
  type QuizQuestion,
} from '../../data/quizzes';
import { STATES } from '../../data/states';
import { pickRight, pickWrong } from '../../lib/copy';
import { sfx } from '../../lib/fx';
import { useCountUp, useToast } from '../../lib/hooks';
import { shareText } from '../../lib/share';
import { starsFor, useProgress } from '../../state/progress';
import Confetti from '../../components/Confetti';
import Icon from '../../components/Icon';
import Mascot from '../../components/Mascot';
import NigeriaMap, { type MapMark } from '../../components/NigeriaMap';
import { Button, Sheet } from '../../components/ui';

const LIVES = 3;

function MatchGame({
  q,
  onDone,
}: {
  q: MatchQuestion;
  onDone: (mistakes: number) => void;
}) {
  const left = useMemo(() => shuffle(q.pairs.map((p, pi) => ({ t: p[0], pi }))), [q]);
  const right = useMemo(() => shuffle(q.pairs.map((p, pi) => ({ t: p[1], pi }))), [q]);
  const [selL, setSelL] = useState<number | null>(null);
  const [done, setDone] = useState<number[]>([]);
  const [bad, setBad] = useState<{ l: number; r: number } | null>(null);
  const mistakes = useRef(0);

  const pickL = (pi: number) => {
    if (done.includes(pi)) return;
    sfx.select();
    setSelL(pi);
  };

  const pickR = (pi: number) => {
    if (done.includes(pi) || selL === null) return;
    if (pi === selL) {
      sfx.pop();
      const nd = [...done, pi];
      setDone(nd);
      setSelL(null);
      if (nd.length === q.pairs.length) {
        setTimeout(() => onDone(mistakes.current), 450);
      }
    } else {
      mistakes.current += 1;
      sfx.wrong();
      setBad({ l: selL, r: pi });
      setSelL(null);
      setTimeout(() => setBad(null), 520);
    }
  };

  return (
    <View style={styles.match}>
      <View style={styles.matchCol}>
        {left.map((it) => {
          const isDone = done.includes(it.pi);
          const isSel = selL === it.pi;
          const isBad = bad?.l === it.pi;
          return (
            <Pressable
              key={it.t}
              disabled={isDone}
              onPress={() => pickL(it.pi)}
              style={[
                styles.matchTile,
                isDone && styles.matchDone,
                isSel && styles.matchSel,
                isBad && styles.matchBad,
              ]}
            >
              <Text style={styles.matchText}>{it.t}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.matchCol}>
        {right.map((it) => {
          const isDone = done.includes(it.pi);
          const isBad = bad?.r === it.pi;
          return (
            <Pressable
              key={it.t}
              disabled={isDone}
              onPress={() => pickR(it.pi)}
              style={[
                styles.matchTile,
                isDone && styles.matchDone,
                isBad && styles.matchBad,
              ]}
            >
              <Text style={styles.matchText}>{it.t}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Results({
  metaName,
  right,
  total,
  xp,
  secs,
  boom,
  onDone,
  onRetry,
}: {
  metaName: string;
  right: number;
  total: number;
  xp: number;
  secs: number;
  boom: number;
  onDone: () => void;
  onRetry: () => void;
}) {
  const pct = Math.round((right / total) * 100);
  const stars = starsFor(pct);
  const shownXp = useCountUp(xp, 900);
  const title =
    pct >= 90
      ? 'Perfect run!'
      : pct >= 70
        ? 'Great job!'
        : pct >= 50
          ? 'Nice work!'
          : 'Keep practising!';
  const m = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const toast = useToast();

  useEffect(() => {
    const t = setTimeout(() => sfx.xp(), 400);
    return () => clearTimeout(t);
  }, []);

  const share = async () => {
    const r = await shareText({
      title: 'HeritageHub',
      text: `I scored ${right}/${total} on "${metaName}" on HeritageHub 🇳🇬 — can you beat me?`,
    });
    if (r === 'copied') toast({ emoji: '📋', text: 'Copied to clipboard' });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.resultsScreen}>
        <Confetti fire={boom} power={1.7} origin={[0.5, 0.3]} />
        <View style={styles.resultsHero}>
          <Mascot mood={pct >= 50 ? 'cheer' : 'happy'} size={142} />
          <Text style={styles.resultsTitle}>{title}</Text>
          <Text style={styles.resultsSub}>{metaName} complete</Text>
          <View style={styles.starRow} accessibilityLabel={`${stars} of 3 stars`}>
            {[0, 1, 2].map((k) => (
              <Icon
                key={k}
                name="star"
                size={50}
                color={k < stars ? COLORS.gold : '#25463a'}
              />
            ))}
          </View>
        </View>

        <View style={styles.statCards}>
          <View style={[styles.statCard, { borderColor: COLORS.gold }]}>
            <Text style={styles.statCardLabel}>TOTAL XP</Text>
            <View style={styles.statCardValRow}>
              <Icon name="bolt" size={20} color={COLORS.gold} />
              <Text style={[styles.statCardVal, { color: COLORS.gold }]}>{shownXp}</Text>
            </View>
          </View>
          <View style={[styles.statCard, { borderColor: COLORS.green }]}>
            <Text style={styles.statCardLabel}>ACCURACY</Text>
            <Text style={[styles.statCardVal, { color: COLORS.green }]}>{pct}%</Text>
          </View>
          <View style={[styles.statCard, { borderColor: COLORS.blue }]}>
            <Text style={styles.statCardLabel}>TIME</Text>
            <Text style={[styles.statCardVal, { color: COLORS.blue }]}>{m}</Text>
          </View>
        </View>

        <View style={styles.resultsFoot}>
          <Button variant="primary" size="lg" block onPress={onDone}>
            Continue
          </Button>
          <View style={styles.btnRow}>
            <View style={{ flex: 1 }}>
              <Button variant="ghost" block icon="share" onPress={share}>
                Share
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button variant="ghost" block icon="refresh" onPress={onRetry}>
                Again
              </Button>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function OutOfHearts({
  onDone,
  onRetry,
}: {
  onDone: () => void;
  onRetry: () => void;
}) {
  useEffect(() => {
    sfx.wrong();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.resultsScreen}>
        <View style={styles.resultsHero}>
          <Mascot mood="sad" size={142} />
          <Text style={styles.resultsTitle}>Out of hearts</Text>
          <Text style={styles.resultsSub}>
            Every expert slips up. Review the lesson and try again — you&apos;ve got this!
          </Text>
          <View style={styles.heartsEmpty}>
            {[0, 1, 2].map((k) => (
              <Icon key={k} name="heart" size={38} color="#3a2a2e" />
            ))}
          </View>
        </View>
        <View style={styles.resultsFoot}>
          <Button variant="primary" size="lg" block icon="refresh" onPress={onRetry}>
            Try again
          </Button>
          <Button variant="ghost" block onPress={onDone}>
            Back to lessons
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

function QuizRun({
  id,
  questions,
  onRetry,
}: {
  id: string;
  questions: QuizQuestion[];
  onRetry: () => void;
}) {
  const toast = useToast();
  const { recordQuiz, addMiss, clearMiss, settings } = useProgress();
  const metaName = QUIZ_META[id]?.name || byId(id)?.name || 'Quiz';

  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<'answering' | 'correct' | 'wrong'>('answering');
  const [lives, setLives] = useState(LIVES);
  const [right, setRight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [phase, setPhase] = useState<'play' | 'won' | 'lost'>('play');
  const [quit, setQuit] = useState(false);
  const [boom, setBoom] = useState(0);
  const [line, setLine] = useState('');
  const [t0] = useState(() => Date.now());
  const [secs, setSecs] = useState(0);
  const recorded = useRef(false);

  const q = questions[i];
  const total = questions.length;
  const xp = right * 10 + (right === total ? 10 : 0);
  const resolved = status !== 'answering';

  const resolve = useCallback(
    (ok: boolean) => {
      setStatus(ok ? 'correct' : 'wrong');
      setLine(ok ? pickRight(settings.pidgin) : pickWrong(settings.pidgin));
      if (ok) {
        clearMiss(q.key);
        sfx.correct();
        setRight((r) => r + 1);
        setBoom((b) => b + 1);
        const n = combo + 1;
        setCombo(n);
        if (n >= 3) toast({ emoji: '🔥', text: `${n} in a row!` });
      } else {
        addMiss(q.key);
        sfx.wrong();
        setCombo(0);
        setLives((l) => l - 1);
      }
    },
    [combo, toast, q, settings.pidgin, addMiss, clearMiss]
  );

  const check = useCallback(() => {
    if (q.type === 'mc' && sel !== null) resolve(sel === q.answer);
    else if (q.type === 'map' && picked) resolve(picked === q.target);
  }, [sel, picked, q, resolve]);

  const next = useCallback(() => {
    sfx.tap();
    if (status === 'wrong' && lives <= 0) {
      setPhase('lost');
      return;
    }
    if (i + 1 >= total) {
      setSecs(Math.round((Date.now() - t0) / 1000));
      setPhase('won');
      sfx.win();
      setBoom((b) => b + 1);
      return;
    }
    setI((n) => n + 1);
    setSel(null);
    setPicked(null);
    setStatus('answering');
  }, [status, lives, i, total, t0]);

  useEffect(() => {
    if (phase === 'won' && !recorded.current) {
      recorded.current = true;
      recordQuiz(id, { correct: right, total, xp });
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/quizzes');
  };

  if (phase === 'won') {
    return (
      <Results
        metaName={metaName}
        right={right}
        total={total}
        xp={xp}
        secs={secs}
        boom={boom}
        onDone={goBack}
        onRetry={onRetry}
      />
    );
  }

  if (phase === 'lost') {
    return <OutOfHearts onDone={goBack} onRetry={onRetry} />;
  }

  const progress = ((i + (resolved ? 1 : 0)) / total) * 100;
  const mood = status === 'correct' ? 'cheer' : status === 'wrong' ? 'sad' : 'happy';
  const answerText =
    q.type === 'mc'
      ? q.options[q.answer]
      : q.type === 'map'
        ? STATES.find((x) => x.id === q.target)?.name
        : null;

  const mapMarks: Record<string, MapMark> =
    q.type !== 'map'
      ? {}
      : resolved
        ? {
            [q.target]: 'right',
            ...(picked && picked !== q.target ? { [picked]: 'wrong' } : {}),
          }
        : picked
          ? { [picked]: 'sel' }
          : {};

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top progress & hearts */}
      <View style={styles.quizTop}>
        <Pressable
          accessibilityLabel="Quit quiz"
          onPress={() => {
            sfx.tap();
            setQuit(true);
          }}
          style={styles.closeBtn}
        >
          <Icon name="x" size={20} color={COLORS.text} />
        </Pressable>
        <View style={styles.qbar}>
          <View style={[styles.qbarFill, { width: `${Math.max(progress, 5)}%` }]} />
        </View>
        <View style={styles.hearts} accessibilityLabel={`${lives} lives left`}>
          <Icon name="heart" size={24} color={COLORS.red} />
          <Text style={styles.heartsText}>{lives}</Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={styles.quizBody}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ask}>
          <Mascot mood={mood} size={80} />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{q.q}</Text>
          </View>
        </View>

        {q.type === 'map' && (
          <View style={{ marginBottom: 14 }}>
            <NigeriaMap
              marks={mapMarks}
              interactive={!resolved}
              onPick={(sid) => {
                sfx.select();
                setPicked(sid);
              }}
            />
          </View>
        )}

        {q.type === 'mc' && q.highlight && (
          <View style={{ marginBottom: 14 }}>
            <NigeriaMap
              interactive={false}
              zoomControls={false}
              marks={{ [q.highlight]: resolved ? 'right' : 'target' }}
            />
          </View>
        )}

        {q.type === 'mc' ? (
          <View style={styles.opts}>
            {q.options.map((o, k) => {
              const isSel = !resolved && sel === k;
              const isRight = resolved && k === q.answer;
              const isWrong = resolved && k !== q.answer && sel === k;
              const isDim = resolved && k !== q.answer && sel !== k;

              return (
                <Pressable
                  key={`${i}-${k}`}
                  disabled={resolved}
                  onPress={() => {
                    sfx.select();
                    setSel(k);
                  }}
                  style={[
                    styles.opt,
                    isSel && styles.optSel,
                    isRight && styles.optRight,
                    isWrong && styles.optWrong,
                    isDim && { opacity: 0.4 },
                  ]}
                >
                  <View
                    style={[
                      styles.optKey,
                      isSel && styles.optKeySel,
                      isRight && styles.optKeyRight,
                      isWrong && styles.optKeyWrong,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optKeyText,
                        isSel && { color: COLORS.blue },
                        isRight && { color: COLORS.onBright },
                        isWrong && { color: COLORS.white },
                      ]}
                    >
                      {k + 1}
                    </Text>
                  </View>
                  <Text style={styles.optText}>{o}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : q.type === 'match' ? (
          <MatchGame key={i} q={q} onDone={(m) => resolve(m < 3)} />
        ) : null}
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.quizFoot,
          status === 'correct' && styles.footCorrect,
          status === 'wrong' && styles.footWrong,
        ]}
      >
        {!resolved ? (
          q.type === 'mc' || q.type === 'map' ? (
            <Button
              variant="primary"
              size="lg"
              block
              disabled={q.type === 'mc' ? sel === null : !picked}
              onPress={check}
              sound={false}
            >
              Check
            </Button>
          ) : (
            <Text style={styles.footHint}>
              Tap a name on the left, then its match on the right.
            </Text>
          )
        ) : (
          <View style={styles.feedback}>
            <View style={styles.feedbackHead}>
              <View
                style={[
                  styles.feedbackIcon,
                  status === 'correct'
                    ? { backgroundColor: COLORS.green }
                    : { backgroundColor: COLORS.red },
                ]}
              >
                <Icon
                  name={status === 'correct' ? 'check' : 'x'}
                  size={20}
                  color={status === 'correct' ? COLORS.onBright : COLORS.white}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.feedbackTitle,
                    { color: status === 'correct' ? '#7dffb6' : '#ff98a2' },
                  ]}
                >
                  {line}
                  {status === 'correct' && (
                    <Text style={{ color: COLORS.gold }}> +10 XP</Text>
                  )}
                </Text>
                {status === 'wrong' && answerText ? (
                  <Text style={styles.answerText}>
                    Correct answer: <Text style={{ fontWeight: '900', color: COLORS.white }}>{answerText}</Text>
                  </Text>
                ) : null}
              </View>
            </View>
            {q.fact ? <Text style={styles.factText}>{q.fact}</Text> : null}
            <Button
              variant={status === 'correct' ? 'primary' : 'danger'}
              size="lg"
              block
              onPress={next}
              sound={false}
            >
              {status === 'wrong' && lives <= 0 ? 'See results' : 'Continue'}
            </Button>
          </View>
        )}
      </View>

      <Confetti fire={boom} power={0.45} origin={[0.5, 0.82]} />

      <Sheet open={quit} onClose={() => setQuit(false)} title="Quit this quiz?">
        <View style={styles.quitBody}>
          <Mascot mood="sad" size={88} />
          <Text style={styles.quitText}>
            You&apos;ll lose your progress in this run. Your streak and saved XP stay safe.
          </Text>
        </View>
        <Button variant="primary" block onPress={() => setQuit(false)}>
          Keep learning
        </Button>
        <Button variant="ghost-danger" block onPress={goBack}>
          End session
        </Button>
      </Sheet>
    </SafeAreaView>
  );
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const quizId = typeof id === 'string' ? id : 'daily';
  const { missed } = useProgress();
  const [run, setRun] = useState(0);
  const [missedKeys] = useState(() => Object.keys(missed));

  const valid = !!(QUIZ_META[quizId] || byId(quizId));
  const questions = useMemo(
    () => (valid ? buildQuiz(quizId, missedKeys).map(shuffleOptions) : []),
    [quizId, run, valid, missedKeys] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!valid || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.resultsScreen}>
          <View style={styles.resultsHero}>
            <Mascot mood="happy" size={120} />
            <Text style={styles.resultsTitle}>No questions ready</Text>
            <Text style={styles.resultsSub}>
              Pick a module quiz or daily challenge to get started!
            </Text>
          </View>
          <Button variant="primary" block onPress={() => router.replace('/quizzes')}>
            Back to Quizzes
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <QuizRun
      key={`${quizId}-${run}`}
      id={quizId}
      questions={questions}
      onRetry={() => setRun((r) => r + 1)}
    />
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg0,
  },
  quizTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.surface2,
    borderWidth: 2,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qbar: {
    flex: 1,
    height: 14,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  qbarFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: COLORS.green,
  },
  hearts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartsText: {
    color: COLORS.red,
    fontWeight: '900',
    fontSize: 18,
  },
  quizBody: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
  },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  bubble: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
  },
  bubbleText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 17.5,
    lineHeight: 23,
  },
  opts: {
    gap: 12,
  },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#13281c',
  },
  optSel: {
    borderColor: COLORS.blue,
    backgroundColor: 'rgba(61,139,255,0.15)',
    borderBottomColor: COLORS.blueDeep,
  },
  optRight: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(37,217,126,0.17)',
    borderBottomColor: COLORS.greenDeep,
  },
  optWrong: {
    borderColor: COLORS.red,
    backgroundColor: 'rgba(255,93,108,0.15)',
    borderBottomColor: COLORS.redDeep,
  },
  optKey: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optKeySel: {
    borderColor: COLORS.blue,
  },
  optKeyRight: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  optKeyWrong: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  optKeyText: {
    color: COLORS.text2,
    fontSize: 14,
    fontWeight: '900',
  },
  optText: {
    flex: 1,
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 16.5,
    lineHeight: 21,
  },
  match: {
    flexDirection: 'row',
    gap: 12,
  },
  matchCol: {
    flex: 1,
    gap: 12,
  },
  matchTile: {
    minHeight: 58,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#13281c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchSel: {
    borderColor: COLORS.blue,
    backgroundColor: 'rgba(61,139,255,0.16)',
    borderBottomColor: COLORS.blueDeep,
  },
  matchDone: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(37,217,126,0.14)',
    borderBottomColor: COLORS.greenDeep,
    opacity: 0.55,
  },
  matchBad: {
    borderColor: COLORS.red,
    backgroundColor: 'rgba(255,93,108,0.15)',
    borderBottomColor: COLORS.redDeep,
  },
  matchText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15,
    textAlign: 'center',
  },
  quizFoot: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  footCorrect: {
    backgroundColor: '#0c3a21',
    borderTopColor: 'rgba(37,217,126,0.4)',
  },
  footWrong: {
    backgroundColor: '#3a1019',
    borderTopColor: 'rgba(255,93,108,0.4)',
  },
  footHint: {
    textAlign: 'center',
    color: COLORS.text2,
    paddingVertical: 10,
    fontWeight: '700',
  },
  feedback: {
    gap: 10,
  },
  feedbackHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 21,
  },
  answerText: {
    color: '#ffc3c9',
    fontSize: 14.5,
    marginTop: 2,
  },
  factText: {
    color: COLORS.text2,
    fontSize: 14.5,
    lineHeight: 20,
  },
  quitBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  quitText: {
    flex: 1,
    color: COLORS.text2,
    fontSize: 14.5,
    lineHeight: 20,
  },
  resultsScreen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  resultsHero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resultsTitle: {
    fontFamily: FONTS.display,
    fontSize: 34,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 6,
  },
  resultsSub: {
    color: COLORS.text2,
    fontSize: 15.5,
    textAlign: 'center',
    maxWidth: 280,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  heartsEmpty: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statCards: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 18,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    alignItems: 'center',
  },
  statCardLabel: {
    color: COLORS.text2,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  statCardValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statCardVal: {
    fontFamily: FONTS.display,
    fontSize: 24,
    marginTop: 4,
  },
  resultsFoot: {
    gap: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
});

